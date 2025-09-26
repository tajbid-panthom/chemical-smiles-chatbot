from llama_cpp import Llama

# Load local model
llm = Llama(
    model_path="models/llama-2-7b-chat.Q4_K_M.gguf",
    n_ctx=2048,   # context window
    n_threads=8,  # adjust to your CPU cores
    n_gpu_layers=20  # if you have GPU (set 0 if CPU only)
)

def run_llm(prompt: str) -> str:
    output = llm(
        prompt,
        max_tokens=256,
        stop=["</s>", "User:"],
        echo=False
    )
    return output["choices"][0]["text"].strip()
