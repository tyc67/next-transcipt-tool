export const combinedPrompt = (context: string, question: string) => {
  const prompt = `
    Context sections:
    ${context}
    
    Question: """
    ${question}
    """
    
    Answer as markdown:`

  return prompt
}
