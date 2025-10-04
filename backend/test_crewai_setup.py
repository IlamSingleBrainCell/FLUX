#!/usr/bin/env python3
"""Quick test to verify CrewAI setup"""

import sys
import os
from dotenv import load_dotenv

print("=" * 60)
print("🔍 FLUX CrewAI Setup Verification")
print("=" * 60)

# 1. Python version
print(f"\n✓ Python: {sys.version.split()[0]}")

# 2. Check imports
try:
    from crewai import Agent, Task, Crew
    print("✓ CrewAI: Imported successfully")
except ImportError as e:
    print(f"✗ CrewAI: Import failed - {e}")
    sys.exit(1)

try:
    import groq
    print("✓ Groq: Imported successfully")
except ImportError as e:
    print(f"✗ Groq: Import failed - {e}")
    sys.exit(1)

try:
    from langchain_groq import ChatGroq
    print("✓ LangChain-Groq: Imported successfully")
except ImportError as e:
    print(f"✗ LangChain-Groq: Import failed - {e}")
    sys.exit(1)

# 3. Check API key
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
if api_key:
    print(f"✓ GROQ_API_KEY: Set ({api_key[:8]}...{api_key[-4:]})")
else:
    print("✗ GROQ_API_KEY: MISSING - Add to .env file")
    sys.exit(1)

# 4. Test CrewAI initialization
try:
    from agents.crewai_agents import get_crewai_system
    crewai = get_crewai_system()
    print("✓ CrewAI System: Initialized successfully")
    print(f"  - Agents loaded: {len(crewai.agents)}")
except Exception as e:
    print(f"✗ CrewAI System: Initialization failed - {e}")
    sys.exit(1)

print("\n" + "=" * 60)
print("✅ ALL CHECKS PASSED - CrewAI is ready!")
print("=" * 60)
print("\n🚀 Next step: Run 'python main_crewai.py' to start server")
