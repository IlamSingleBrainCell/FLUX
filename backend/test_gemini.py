#!/usr/bin/env python3
"""Test Google Gemini integration"""

import os
import sys
from dotenv import load_dotenv

print("=" * 60)
print("🧪 Testing Google Gemini Integration")
print("=" * 60)

# Load environment
load_dotenv()

# 1. Check API key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("❌ GOOGLE_API_KEY not found in .env")
    sys.exit(1)
print(f"✅ API Key loaded: {api_key[:20]}...{api_key[-10:]}")

# 2. Test import
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    print("✅ Google Gemini package imported")
except ImportError as e:
    print(f"❌ Import failed: {e}")
    print("Run: pip install langchain-google-genai")
    sys.exit(1)

# 3. Test LLM initialization
try:
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=api_key,
        temperature=0.7,
        convert_system_message_to_human=True
    )
    print("✅ Gemini LLM initialized (gemini-1.5-flash)")
except Exception as e:
    print(f"❌ LLM initialization failed: {e}")
    sys.exit(1)

# 4. Test actual API call
try:
    print("\n🔄 Testing real API call...")
    response = llm.invoke("Say 'Hello from Gemini!' in one sentence.")
    print(f"✅ API call successful!")
    print(f"📝 Response: {response.content}")
except Exception as e:
    print(f"❌ API call failed: {e}")
    sys.exit(1)

# 5. Test CrewAI integration
try:
    from crewai import Agent
    from agents.crewai_agents import get_groq_llm
    
    print("\n🔄 Testing CrewAI integration...")
    llm = get_groq_llm()
    
    test_agent = Agent(
        role="Test Agent",
        goal="Test Gemini integration",
        backstory="I'm testing if Gemini works with CrewAI",
        llm=llm,
        verbose=False
    )
    print("✅ CrewAI agent created with Gemini")
    
except Exception as e:
    print(f"❌ CrewAI integration failed: {e}")
    sys.exit(1)

print("\n" + "=" * 60)
print("✅ ALL TESTS PASSED - Gemini is working!")
print("=" * 60)
print("\n🚀 Ready to start: python main_crewai.py")
