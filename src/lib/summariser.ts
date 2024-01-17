import OpenAI from "openai";
const openai = new OpenAI();

export class Summariser{
    public constructor(){
    }

    public async summarise(transcript: string) {
        const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: "Please can you summarise this: " + transcript}],
          model: "gpt-3.5-turbo",
        });
        
        return(completion.choices[0]["message"]["content"]);
      }
}