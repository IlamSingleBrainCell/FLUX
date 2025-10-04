#!/usr/bin/env python3
"""Test CrewAI with Gemini using built-in LLM wrapper"""

import os
import sys
from dotenv import load_dotenv

print("=" * 60)
print("🧪 Testing CrewAI + Gemini (Built-in Wrapper)")
print("=" * 60)

load_dotenv()

# Check API key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("❌ GOOGLE_API_KEY not set")
    sys.exit(1)
print(f"✅ API Key: {api_key[:20]}...")

# Test CrewAI's LLM class
try:
    from crewai import LLM, Agent, Task, Crew
    print("✅ CrewAI imports successful")
except ImportError as e:
    print(f"❌ Import failed: {e}")
    sys.exit(1)

# Initialize Gemini with CrewAI's LLM wrapper
try:
    llm = LLM(
        model="gemini/gemini-1.5-flash",
        api_key=api_key,
        temperature=0.7
    )
    print("✅ Gemini LLM initialized (gemini-1.5-flash)")
except Exception as e:
    print(f"❌ LLM init failed: {e}")
    sys.exit(1)

# Create test agent
try:
    agent = Agent(
        role="Test Agent",
        goal="Say hello",
        backstory="I'm testing Gemini integration",
        llm=llm,
        verbose=True
    )
    print("✅ Agent created")
except Exception as e:
    print(f"❌ Agent creation failed: {e}")
    sys.exit(1)

# Create simple task
try:
    task = Task(
        description="Say 'Hello from Gemini!' in a friendly way",
        agent=agent,
        expected_output="A friendly greeting"
    )
    print("✅ Task created")
except Exception as e:
    print(f"❌ Task creation failed: {e}")
    sys.exit(1)

# Run the crew
try:
    print("\n🔄 Running test crew...")
    crew = Crew(
        agents=[agent],
        tasks=[task],
        verbose=True
    )
    
    result = crew.kickoff()
    print("\n" + "=" * 60)
    print("✅ SUCCESS! Gemini is working with CrewAI!")
    print("=" * 60)
    print(f"\n📝 Agent Response:\n{result}")
    
except Exception as e:
    print(f"\n❌ Crew execution failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n🚀 Ready to run main_crewai.py!")
