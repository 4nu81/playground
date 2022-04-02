import csv
import smtplib
import ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from os import environ as env

from dotenv import load_dotenv

load_dotenv()

smtp = env["SMTP"]
port = int(env["SMTP_PORT"])
login = env["LOGIN"]
passwd = env["PASSWD"]


def send(email, mail):
    ssl_context = ssl.create_default_context()
    service = smtplib.SMTP_SSL(smtp, port, context=ssl_context)
    service.login(login, passwd)
    service.sendmail(login, email, mail.as_string())
    service.quit()


def read_csv(filename):
    data = []
    with open(filename, newline="") as csvfile:
        reader = csv.DictReader(csvfile, fieldnames=["email", "name"])
        for row in reader:
            data.append(row)
    return data


def create_mail(email, name):
    filename = f"certificate_{name}.pdf"

    mail = MIMEMultipart("alternative")
    mail["Subject"] = "certificate of participation"
    mail["from"] = login
    mail["To"] = email

    text_template = """
    Hello {0},

    hereby I send your certification of participation at the EQ2022 in Wroclaw.
    This may help you pass the customs at arrival in poland.

    Andi

    The RiC Crew
    Andreas Maertens, Referee-in-Chief
    Jasper van der Horst, Deputy Referee-in-Chief
    Phil Pearson, Deputy Referee-in-Chief
    ECreferees@gmail.com
    """

    html_template = """
    <h3>Hello {0}</h3>

    <p>hereby I send your certification of participation at the EQ2022 in Wroclaw.
    This may help you pass the customs at arrival in poland.</p>
    <br>
    <p>
    Andi

    The RiC Crew
    Andreas Maertens, Referee-in-Chief
    Jasper van der Horst, Deputy Referee-in-Chief
    Phil Pearson, Deputy Referee-in-Chief
    ECreferees@gmail.com
    </p>
    """

    html_content = MIMEText(html_template.format(name), "html")
    text_content = MIMEText(text_template.format(name), "plain")

    mail.attach(text_content)
    mail.attach(html_content)

    filepath = f"certs/{filename}"
    mimeBase = MIMEBase("application", "octet-stream")
    with open(filepath, "rb") as file:
        mimeBase.set_payload(file.read())
    encoders.encode_base64(mimeBase)
    mimeBase.add_header("Content-Disposition", f"attachment; filename={filename}")
    mail.attach(mimeBase)

    return mail


if __name__ == "__main__":
    data = read_csv("mails.csv")
    for line in data:
        email = line["email"]
        name = line["name"]
        try:
            mail = create_mail(email, name)
            send(email, mail)
        except Exception as e:
            print(e)
