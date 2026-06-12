from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import uuid

# Existing Classifier Imports
from predict import get_prediction, get_all_symptoms
from disease_map import DISEASE_SPECIALITY

# RAG/MedBot Imports
from src.helper import download_embeddings
from src.prompt import system_prompt
from langchain_pinecone import PineconeVectorStore
from langchain_mistralai import ChatMistralAI
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_classic.chains import create_history_aware_retriever
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()

app = FastAPI(title="KashDocs Hybrid AI Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. In-Memory Session Store ---
session_store: dict[str, ChatMessageHistory] = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in session_store:
        session_store[session_id] = ChatMessageHistory()
    return session_store[session_id]

# --- 2. Initialize RAG Components ---
try:
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

    if not PINECONE_API_KEY or not MISTRAL_API_KEY:
        print("Warning: API Keys missing. Chat features will be disabled.")
        conversational_rag = None
        retriever = None
        model = None
    else:
        embedding = download_embeddings()
        index_name = "medical-chatbot"
        docsearch = PineconeVectorStore.from_existing_index(
            index_name=index_name,
            embedding=embedding
        )
        retriever = docsearch.as_retriever(search_type="mmr", search_kwargs={"k": 5, "fetch_k": 20})
        model = ChatMistralAI(model="mistral-small-2506")

        # --- Prompt 1: Contextualize or flag as history-only ---
        # If the user asks about the conversation itself, return "HISTORY_ONLY"
        # so we skip Pinecone and answer purely from chat_history.
        contextualize_q_prompt = ChatPromptTemplate.from_messages([
            ("system",
             "Given the chat history and the user's latest question, decide what to do:\n\n"
             "- If the question is asking about the conversation itself "
             "(e.g. 'what symptoms did I mention', 'what did I say last time', "
             "'what was my question', 'do you remember'), "
             "return ONLY the exact string: HISTORY_ONLY\n\n"
             "- Otherwise, rewrite the question as a fully self-contained medical question "
             "(resolving pronouns or references to prior turns). "
             "Do NOT answer it — only rewrite it. "
             "If it is already self-contained, return it as-is."
            ),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])

        history_aware_retriever = create_history_aware_retriever(
            model, retriever, contextualize_q_prompt
        )

        # --- Prompt 2: Answer using retrieved context + full chat history ---
        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "The user has reported the following symptoms or question. "
                      "Address exactly what they said:\n\n{input}"),
        ])

        question_answer_chain = create_stuff_documents_chain(model, qa_prompt)
        rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

        conversational_rag = RunnableWithMessageHistory(
            rag_chain,
            get_session_history,
            input_messages_key="input",
            history_messages_key="chat_history",
            output_messages_key="answer",
        )

        # --- specialty Identification Chain ---
        all_specs = sorted(list(set(DISEASE_SPECIALITY.values())))
        specialty_prompt = ChatPromptTemplate.from_messages([
<<<<<<< HEAD
            ("system", 
             f"Based on the AI's medical advice, which of these specialists should the user consult? "
             f"List: {', '.join(all_specs)}. "
             "If the advice is general or no specific specialist is clearly indicated, return 'None'. "
             "Return ONLY the specialist name or 'None'."
=======
            ("system",
             "You are a medical triage assistant. Read the AI's medical advice and decide "
             "which ONE specialist the patient should consult from this exact list:\n"
             f"{', '.join(all_specs)}.\n\n"
             "Rules:\n"
             "- If the advice points to ANY specific condition, body system, or symptom, "
             "pick the single most appropriate specialist. "
             "For example: skin or hair issues (dandruff, rash, acne, eczema) -> Dermatologist; "
             "heart or blood pressure issues -> Cardiologist; breathing/lung issues -> Pulmonologist; "
             "stomach/liver/digestion issues -> Gastroenterologist; headaches/nerves -> Neurologist; "
             "bones/joints -> Orthopedist.\n"
             "- Only answer 'None' if the advice is purely general wellness with no condition at all.\n"
             "- Respond with ONLY the specialist name, copied exactly from the list above, or 'None'. "
             "Do not add any other words, punctuation, or explanation."
>>>>>>> da2b5acf98a795ff6c4f72453005aa3224bad0ca
            ),
            ("human", "AI Advice: {answer}")
        ])
        specialty_chain = specialty_prompt | model

        print("RAG System (with memory) initialized successfully.")
except Exception as e:
    print(f"Error initializing RAG: {e}")
    conversational_rag = None
    retriever = None
    model = None

# --- 3. Data Models ---
class SymptomsRequest(BaseModel):
    symptoms: list[str]

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None

class ChatResponse(BaseModel):
    answer: str
    session_id: str
    recommended_specialty: str | None = None

# --- 4. Helpers ---
HISTORY_KEYWORDS = [
    "last time", "what did i say", "what symptoms did i", "do you remember",
    "what was my", "what have i told", "my previous", "earlier i said",
    "recall", "what did i mention"
]

def is_history_only_question(message: str) -> bool:
    """Fast local check before even calling the model."""
    lowered = message.lower()
    return any(kw in lowered for kw in HISTORY_KEYWORDS)

def answer_from_history(message: str, history: ChatMessageHistory) -> str:
    """Answer questions about prior conversation directly from chat_history."""
    if not history.messages:
        return "We haven't discussed anything yet in this session. Feel free to describe your symptoms!"

    # Build a simple summary of what the user said previously
    user_messages = [
        m.content for m in history.messages if isinstance(m, HumanMessage)
    ]
    if not user_messages:
        return "I don't have any previous messages from you in this session."

    summary = "\n".join(f"- {msg}" for msg in user_messages)
    return (
        f"Based on our conversation so far, here's what you told me:\n{summary}\n\n"
        "Is there anything specific from this you'd like to follow up on?"
    )

<<<<<<< HEAD
=======
# Canonical specialty list (independent of RAG init so detection always works)
ALL_SPECIALTIES = sorted(set(DISEASE_SPECIALITY.values()))

# Extra keyword hints for common terms that may not appear in the disease map
KEYWORD_SPECIALTY = {
    "dandruff": "Dermatologist",
    "seborrheic": "Dermatologist",
    "eczema": "Dermatologist",
    "rash": "Dermatologist",
    "acne": "Dermatologist",
    "pimple": "Dermatologist",
    "skin": "Dermatologist",
    "scalp": "Dermatologist",
    "hair fall": "Dermatologist",
    "hair loss": "Dermatologist",
    "dermat": "Dermatologist",
    "cardio": "Cardiologist",
    "blood pressure": "Cardiologist",
    "hypertension": "Cardiologist",
    "neurolog": "Neurologist",
    "migraine": "Neurologist",
    "pulmonolog": "Pulmonologist",
    "asthma": "Pulmonologist",
    "gastro": "Gastroenterologist",
    "orthoped": "Orthopedist",
    "joint pain": "Orthopedist",
    "endocrin": "Endocrinologist",
    "thyroid": "Endocrinologist",
    "diabetes": "Endocrinologist",
}

def detect_specialty(answer: str) -> str | None:
    """Robustly figure out which specialist the answer points to.

    Strategy (cheapest/most reliable first):
      1. The answer already names a known specialty.
      2. The answer mentions a known disease -> map to its specialty.
      3. The answer contains a known keyword hint (e.g. 'dandruff').
      4. Ask the LLM specialty chain and normalise its output to a known specialty.
    """
    if not answer:
        return None
    lowered = answer.lower()

    # 1. Direct specialty name mention
    for spec in ALL_SPECIALTIES:
        if spec.lower() in lowered:
            return spec

    # 2. Known disease keyword -> mapped specialty
    for disease, spec in DISEASE_SPECIALITY.items():
        if disease.lower() in lowered:
            return spec

    # 3. Supplemental keyword hints
    for keyword, spec in KEYWORD_SPECIALTY.items():
        if keyword in lowered:
            return spec

    # 4. LLM-based inference (normalised to a known specialty)
    chain = globals().get("specialty_chain")
    if chain is not None:
        try:
            resp = chain.invoke({"answer": answer})
            raw = (resp.content or "").strip()
            if raw and raw.lower() != "none":
                raw_lower = raw.lower()
                for spec in ALL_SPECIALTIES:
                    if spec.lower() in raw_lower:
                        return spec
        except Exception as e:
            print(f"Specialty detection error: {e}")

    return None

>>>>>>> da2b5acf98a795ff6c4f72453005aa3224bad0ca
# --- 5. Endpoints ---

@app.get("/")
def root():
    return {"status": "KashDocs Hybrid AI Service running"}

# A. The Symptom Classifier
@app.get("/symptoms")
def symptoms():
    return {"symptoms": get_all_symptoms()}

@app.post("/predict")
def predict(body: SymptomsRequest):
    if len(body.symptoms) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 symptoms")

    result = get_prediction(body.symptoms)
    disease = result["disease"]
    speciality = DISEASE_SPECIALITY.get(disease, "General Physician")

    return {
        "disease": disease,
        "confidence": result["confidence"],
        "speciality": speciality,
        "top_predictions": result["top_predictions"]
    }

# B. The Conversational Chat (stateful)
@app.post("/chat", response_model=ChatResponse)
def chat(body: ChatRequest):
    if not conversational_rag:
        raise HTTPException(status_code=503, detail="Chat service is currently unavailable (check API keys)")

    session_id = body.session_id or str(uuid.uuid4())
    history = get_session_history(session_id)

    try:
        # Short-circuit: if asking about the conversation, skip Pinecone entirely
        if is_history_only_question(body.message):
            answer = answer_from_history(body.message, history)
            # Still save the exchange to history so follow-ups work
            history.add_user_message(body.message)
            history.add_ai_message(answer)
            return ChatResponse(answer=answer, session_id=session_id)

        # Normal flow: retrieve from Pinecone + answer
        response = conversational_rag.invoke(
            {"input": body.message},
            config={"configurable": {"session_id": session_id}},
        )
        answer = response["answer"]

<<<<<<< HEAD
        # Identify specialty
        recommended_specialty = None
        if specialty_chain:
            try:
                spec_response = specialty_chain.invoke({"answer": answer})
                spec_name = spec_response.content.strip()
                if spec_name != "None":
                    recommended_specialty = spec_name
            except Exception as e:
                print(f"Specialty identification error: {e}")
=======
        # Identify specialty (robust, multi-strategy detection)
        recommended_specialty = detect_specialty(answer)
>>>>>>> da2b5acf98a795ff6c4f72453005aa3224bad0ca

        return ChatResponse(
            answer=answer, 
            session_id=session_id, 
            recommended_specialty=recommended_specialty
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# C. Clear a session
@app.delete("/chat/{session_id}")
def clear_session(session_id: str):
    if session_id in session_store:
        del session_store[session_id]
        return {"status": "session cleared", "session_id": session_id}
    raise HTTPException(status_code=404, detail="Session not found")

# D. Debug endpoint — check what Pinecone returns for a query. REMOVE IN PRODUCTION.
@app.get("/debug/retrieval")
def debug_retrieval(query: str):
    if not retriever:
        raise HTTPException(status_code=503, detail="RAG not initialized")
    try:
        docs = retriever.invoke(query)
        return {
            "query": query,
            "num_docs_returned": len(docs),
            "docs": [
                {
                    "chunk_index": i,
                    "source": doc.metadata.get("source", "unknown"),
                    "content_preview": doc.page_content[:300],
                }
                for i, doc in enumerate(docs)
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
