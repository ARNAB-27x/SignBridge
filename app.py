from flask import session,Flask,render_template,request,redirect,flash,url_for
import mysql.connector as ms
from datetime import date
def get_db():
    return ms.connect(
        host="localhost",
        user="root",
        passwd="arnab",
        database="sign"
    )
username=""
app=Flask(__name__)
app.secret_key="arnab"

@app.route("/")
@app.route("/login.html")
def loginpage():
    session.clear()
    return render_template("login.html")

@app.route("/signup.html")
def signuppage():
    return render_template("signup.html")

@app.route("/signup.html",methods=["POST"])
def signup():
    name=request.form["name"]
    email=request.form["email"]
    password=request.form["password"]
    tarik=date.today()
    mycon = get_db()
    mycursor = mycon.cursor()
    mycursor.execute("select * from users where email='{em}' and password='{pa}'".format(em=email,pa=password));
    a=mycursor.fetchone()
    if a:
        return redirect("/login.html?noti=exists")
    else:
        mycursor.execute("insert into users(name,email,password,joiningdate) values('{na}','{em}','{pas}','{jd}')".format(na=name,em=email,pas=password,jd=tarik))
        mycon.commit()

        return render_template("/login.html")
   
    
@app.route("/main.html")
def mainpage():
    if "username" not in session:
        return redirect("/login.html")
    return render_template("main.html", username=session["username"])
 

@app.route("/login.html",methods=["POST"])
def login():
      email=request.form["email"]
      password=request.form["password"]
      mycon = get_db()
      mycursor = mycon.cursor()
      mycursor.execute("select * from users where email='{em}' and password='{pa}'".format(em=email,pa=password));
      a=mycursor.fetchone()


      if a:
          session["username"] = a[1]
          return redirect(url_for('mainpage'))
      else:
         return redirect("/login.html?noti=wrong")
      





@app.route("/editprofile.html")
def editprofile():
    if "username" not in session:
        return redirect("/login.html?noti=false")
    return render_template("/editprofile.html")



@app.route("/viewprofile.html")
def profile():
    if "username" not in session:
        return redirect("/login.html?noti=false")

    mycon = get_db()
    mycursor = mycon.cursor()
    

    mycursor.execute(
        "SELECT email, joiningdate FROM users WHERE name=%s",
        (session["username"],)
    )

    user = mycursor.fetchone()
    mycon.close()

    return render_template(
        "/viewprofile.html",
        username=session["username"],
        em=user[0],
        join=(user[1].strftime("%d %b %Y"))
    )


@app.route("/aboutus.html")
def aboutus():
    return render_template("/aboutus.html")



@app.route("/contactus.html")
def contactus():
    return render_template("/contactus.html")





@app.context_processor
def inject_user():
    return dict(username=session.get("username"))



@app.route("/Signconverter.html",methods=["GET"])
def signconverter():
    if "username" not in session:
        return redirect("/login.html?noti=false")
    return render_template("/devpass.html")

@app.route("/Signtranslate.html",methods=["GET"])
def signtranslate():
    if "username" not in session:
        return redirect("/login.html?noti=false")
    return render_template("/Signtranslate.html")


@app.route("/devpasscheck.html",methods=["POST"])
def devpasscheck():
    devpass=request.form["devpass"]

    if devpass=='arnabwelcome@1234':
        return render_template("/Signconverter.html")
    else:
        return redirect("/main.html?noti=devpls")


@app.route("/Signrules.html",methods=["GET"])
def signrules():
    if "username" not in session:
        return redirect("/login.html?noti=false")
    return render_template("/Signrules.html")


if __name__=="__main__":
    app.run(debug=True)
