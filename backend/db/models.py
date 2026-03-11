import datetime
from sqlalchemy import Column, Boolean, Integer, String, DateTime, Text, ForeignKey
import os
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key = True, index = True)
    username = Column(String,unique = True, index = True)
    email = Column(String,unique = True, index = True)
    created_at = Column(DateTime, default = datetime.datetime.utcnow)

class CV(Base):
    __tablename__ = "cv"
    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer,ForeignKey("users.id"), unique = False, index = True)
    raw_text = Column(String, unique = False, index = True)
    file_path = Column(String, unique = True, index = True)
    created_at = Column(DateTime, default = datetime.datetime.utcnow)


class Joblisting(Base):
    __tablename__ = "joblisting"
    id = Column(Integer, primary_key = True, index = True)
    title = Column(String, unique = False, index = True)
    company = Column(String, unique = False, index = True)
    description = Column(Text, unique = False) # removed index = True because it will make the database slower, can't index text it is too large
    url = Column(String(2048))
    source = Column(String,index = True)
    created_at = Column(DateTime, default = datetime.datetime.utcnow)

class Application(Base):
    __tablename__ = "Application"   # id, user_id, job_id, status, match_score, notes, applied_at
    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer,ForeignKey("users.id"), unique = True, index = True)
    job_id = Column(Integer,ForeignKey("joblisting.id"), unique = True, index = True)
    status = Column(String, default = "applied")
    match_score = Column(Integer, index = True)
    notes = Column(String, unique = False, index = True)
    applied_at = Column(DateTime, default = datetime.datetime.utcnow)

    @property
    def status_messages(self):
        #returns different "applied", "interviewing", "offered", "rejected"
        status_messages = {
            "applied": "Applied",
            "interviewing": "Interviewing",
            "offered": "Offered",
            "rejected": "Rejected"
        }
        return status_messages[self.status]