"""
Quick test to verify CrewAI works with real AI
"""
import os
from dotenv import load_dotenv

# Load environment
load_dotenv()

print("🔧 Environment Check:")
print(f"✅ GROQ_API_KEY: {'SET' if os.getenv('GROQ_API_KEY') else 'MISSING'}")

# Test imports
try:
    from crewai import Agent, Task, Crew
    print("✅ CrewAI imported")
except Exception as e:
    print(f"❌ CrewAI import failed: {e}")
    exit(1)

try:
    from langchain_groq import ChatGroq
    print("✅ ChatGroq imported")
except Exception as e:
    print(f"❌ ChatGroq import failed: {e}")
    exit(1)

# Test Groq LLM
try:
    print("\n🧪 Testing Groq LLM...")
    # For direct LangChain usage (without CrewAI)
    from langchain_groq import ChatGroq as DirectChatGroq
    llm_direct = DirectChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        groq_api_key=os.getenv('GROQ_API_KEY')
    )
    
    # For CrewAI (needs LiteLLM format)
    from crewai import LLM
    llm = LLM(
        model="groq/llama-3.3-70b-versatile",
        temperature=0.7,
        api_key=os.getenv('GROQ_API_KEY')
    )
    
    # Simple test with direct LangChain
    from langchain.schema import HumanMessage
    response = llm_direct.invoke([HumanMessage(content="Say 'Hello from real AI!' in exactly 5 words")])
    print(f"✅ LLM Response: {response.content}")
    print("\n🎉 SUCCESS! Real AI is working!")
    
except Exception as e:
    print(f"❌ LLM test failed: {e}")
    exit(1)

# Test CrewAI Agent
try:
    print("\n🤖 Testing CrewAI Agent...")
    
    agent = Agent(
        role='Test Agent',
        goal='Respond to test queries',
        backstory='I am a test agent to verify CrewAI works',
        llm=llm,
        verbose=True
    )
    
    task = Task(
        description='Say "CrewAI is working!" in a creative way',
        agent=agent,
        expected_output='A creative response'
    )
    
    crew = Crew(
        agents=[agent],
        tasks=[task],
        verbose=True
    )
    
    print("⏳ Running CrewAI (this takes a few seconds)...")
    result = crew.kickoff()
    
    print(f"\n✅ CrewAI Response: {result}")
    print("\n🚀 BOTH TESTS PASSED! CrewAI + Groq are working with REAL AI!")
    
except Exception as e:
    print(f"❌ CrewAI test failed: {e}")
    import traceback
    traceback.print_exc()
    exit(1)
