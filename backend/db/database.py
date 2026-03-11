#SqlAlchemy is the ORM(Object-Relational-Mapping) which handels the connection between the database 
from sqlalchemy import create_engine                  
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import MetaData
import os
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@db:5432/postgres_db")

Session = sessionmaker(bind=engine)

session = Session()

def get_db():
    db = Session()   # opens the session
    try:
        yield db     # give the route, yeild is also the context manager here as it holds and hands control to our route
    finally:
        db.close()   #always close it in the end

#this will serve as the parent class 
class Base(DeclarativeBase):                                 
    metadata = MetaData(
        naming_convention = {
            "ix": "ix_%(column_0_label)s",
            "uq": "uq_%(table_name)s_%(column_0_name)s",
            "ck": "ck_%(table_name)s_%(constraint_name)s",
            "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
            "pk": "pk_%(table_name)s"
        }
    )



    

