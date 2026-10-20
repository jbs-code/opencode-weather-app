export async function ask(
  rl: { question: (message: string) => Promise<string> },
  message: string
): Promise<string> {
  return rl.question(message);
}
