from datetime import datetime, timedelta
import pytz


def generate_delivery_time():
    now = datetime.now()
    pk_timezone = pytz.timezone('Asia/Karachi')
    now = datetime.now(pk_timezone)
    one_hour_later = now + timedelta(hours=1)
    time = one_hour_later.strftime("%Y-%m-%d %I:%M %p")
    return time



class Change_Request():
    def __init__(self, df, order_row, response, column_name):
        self.df = df
        self.order_row = order_row
        self.response = response
        self.column_name = column_name
    def get_response(self):
        parts = self.response.split('::')
        new_info = parts[1]
        self.df.loc[self.order_row.index, [self.column_name]] = new_info
        self.df.to_excel(r'database/orders.xlsx', index=False)
        response = f"""Your {self.column_name} has been changed successfully.\nPlease tell me if I can help you with anything else."""
        return response
    
class Change_Request_Items(Change_Request):
    def get_response(self):
        print(self.response)
        parts = self.response.split('::')
        items = parts[1]
        self.df.loc[self.order_row.index, [self.column_name]] = items
        bill = parts[2]
        self.df.loc[self.order_row.index, ['bill']] = bill
        self.df.to_excel(r'database/orders.xlsx', index=False)
        response = f"""Your {self.column_name} has been changed successfully.\nPlease tell me if I can help you with anything else."""
        return response