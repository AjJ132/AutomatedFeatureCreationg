

from src.usecase.chat.chat_usecase import ChatUseCase


class OrchestrationUseCase:
    def __init__(self,) -> None:
        self.chat_usecase = ChatUseCase()

    def execute(self, initial_prompt: str): 
        # perform initial requirements analysis
        initial_requiremetns_ai_promopt = ""
        with open("src/prompts/INITIAL_REQUIREMENTS_PROMPT.md", "r") as f:
            initial_requiremetns_ai_promopt = f.read()

        requirements_analysis = self.chat_usecase.chat(
            user_message=initial_prompt,
            system_prompt=initial_requiremetns_ai_promopt,
            temperature=0.2,
        )

        return requirements_analysis