#!/usr/bin/env python3
"""
FLUX Agent Test Script
Tests real Groq AI responses from all 5 football agents
"""

import asyncio
import sys
import os

# Add parent directory to path to import from backend
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from agents.requirements_analyst import RequirementsAnalyst
from agents.software_architect import SoftwareArchitect
from agents.developer_agent import DeveloperAgent
from agents.qa_tester import QATester
from agents.devops_engineer import DevOpsEngineer

async def test_single_agent(agent_name: str, agent, test_message: str):
    """Test a single agent with a specific message"""
    print(f"\n{'='*80}")
    print(f"🧪 Testing {agent_name}")
    print(f"{'='*80}")
    print(f"📝 Message: {test_message}")
    print(f"⏳ Waiting for Groq AI response...\n")
    
    try:
        context = {
            "project": "Test Project",
            "uploaded_files": []
        }
        
        response = await agent.process_request(test_message, context)
        
        print(f"✅ Response from {agent_name}:")
        print(f"{'-'*80}")
        print(response)
        print(f"{'-'*80}")
        print(f"📊 Response length: {len(response)} characters")
        print(f"✅ TEST PASSED - {agent_name} generated real response!\n")
        return True
        
    except Exception as e:
        print(f"❌ ERROR testing {agent_name}: {e}")
        print(f"❌ TEST FAILED\n")
        return False

async def main():
    """Run all agent tests"""
    print("""
    ╔═══════════════════════════════════════════════════════════╗
    ║   ⚽ FLUX Agent Communication Test Suite ⚽                ║
    ║                                                           ║
    ║   Testing real Groq AI responses from all agents         ║
    ╚═══════════════════════════════════════════════════════════╝
    """)
    
    # Check for Groq API key
    from dotenv import load_dotenv
    load_dotenv()
    
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("❌ CRITICAL ERROR: GROQ_API_KEY not found in environment!")
        print("Please set your Groq API key in backend/.env file")
        print("Example: GROQ_API_KEY=gsk_xxxxxxxxxxxxx")
        return
    
    print(f"✅ Groq API Key found: {api_key[:10]}...{api_key[-5:]}\n")
    
    # Initialize agents
    agents = {
        "Messi ⚽ (Requirements Analyst)": RequirementsAnalyst(),
        "Ronaldo ⚽ (Software Architect)": SoftwareArchitect(),
        "Neymar ⚽ (Developer)": DeveloperAgent(),
        "Mbappé ⚽ (QA Tester)": QATester(),
        "Benzema ⚽ (DevOps Engineer)": DevOpsEngineer()
    }
    
    # Test messages for each agent
    test_cases = {
        "Messi ⚽ (Requirements Analyst)": "Create user stories for a simple blog platform with authentication",
        "Ronaldo ⚽ (Software Architect)": "Design a microservices architecture for an e-commerce platform",
        "Neymar ⚽ (Developer)": "Write Python code for a REST API endpoint that handles user authentication",
        "Mbappé ⚽ (QA Tester)": "Create test cases for a login functionality with email and password",
        "Benzema ⚽ (DevOps Engineer)": "Create a CI/CD pipeline configuration for deploying a Node.js app to AWS"
    }
    
    # Run tests
    results = {}
    for agent_name, agent in agents.items():
        test_message = test_cases[agent_name]
        success = await test_single_agent(agent_name, agent, test_message)
        results[agent_name] = success
    
    # Summary
    print("\n" + "="*80)
    print("📊 TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for success in results.values() if success)
    total = len(results)
    
    for agent_name, success in results.items():
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {agent_name}")
    
    print(f"\n{'='*80}")
    print(f"Results: {passed}/{total} agents passed")
    print(f"{'='*80}\n")
    
    if passed == total:
        print("🎉 SUCCESS! All agents are generating real Groq AI responses!")
        print("✅ Backend is working correctly")
        print("✅ Agent-to-Agent communication should work")
        print("\n💡 Next steps:")
        print("   1. Start the backend: cd backend && python main.py")
        print("   2. Start the frontend: cd frontend && npm run dev")
        print("   3. Test in browser: http://localhost:3002/workspace")
    else:
        print("⚠️  Some agents failed to respond")
        print("❌ Please check:")
        print("   1. Groq API key is valid")
        print("   2. Internet connection is working")
        print("   3. Groq API rate limits not exceeded")
        print("   4. Check error messages above for details")

if __name__ == "__main__":
    asyncio.run(main())
