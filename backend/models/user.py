from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, userid, username=None, password=None):
        self.id       = userid       
        self.username = username     
        self.password = password     

    def get_id(self):
        return str(self.id)