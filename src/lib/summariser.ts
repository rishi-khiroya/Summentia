import OpenAI from "openai";
const openai = new OpenAI();

export class Summariser{
    public constructor(){
    }

    public async summarise(transcript: String){
        const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: "Please can you summarise this: " + transcript}],
          model: "gpt-3.5-turbo",
        });

        let summary = completion.choices[0]["message"]["content"];
        
        return summary;
      }
}