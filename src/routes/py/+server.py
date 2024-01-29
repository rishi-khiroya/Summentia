from pydantic import BaseModel

class NumberSet(BaseModel):
    a: float
    b: float

async def POST(data: NumberSet):
    return {"sum": data.a + data.b}

async def GET(a: float, b: float):
    return {"sum": a + b}