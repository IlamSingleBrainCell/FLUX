#!/usr/bin/env python3
"""Check available FREE models on OpenRouter"""

import httpx
import os
from dotenv import load_dotenv
import json

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")

print("Fetching available FREE models from OpenRouter...")
print("="*70)

try:
    response = httpx.get(
        "https://openrouter.ai/api/v1/models",
        headers={"Authorization": f"Bearer {api_key}"}
    )
    
    models = response.json()["data"]
    
    # Filter for free models
    free_models = [m for m in models if m.get("pricing", {}).get("prompt") == "0" or ":free" in m["id"]]
    
    print(f"\nFound {len(free_models)} FREE models:\n")
    
    for model in free_models[:15]:  # Show first 15
        print(f"✅ {model['id']}")
        if "context_length" in model:
            print(f"   Context: {model['context_length']:,} tokens")
        print()
    
    print("\n" + "="*70)
    print("Recommended FREE models for FLUX:")
    print("="*70)
    
    # Find working ones
    recommended = [
        "google/gemini-flash-1.5",
        "meta-llama/llama-3.2-3b-instruct",
        "mistralai/mistral-7b-instruct",
        "google/gemini-pro"
    ]
    
    for rec in recommended:
        matching = [m for m in free_models if rec in m["id"]]
        if matching:
            print(f"✅ {matching[0]['id']}")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
