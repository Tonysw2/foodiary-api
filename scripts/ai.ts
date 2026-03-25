import OpenAI from 'openai'

const openai = new OpenAI()

const main = async () => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'user',
        content: 'Is Camila the love of my life?',
      },
    ],
  })

  console.log(JSON.stringify(response, null, 2))
}

main()
