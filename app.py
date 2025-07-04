from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')
@app.route('/2d')
def twoDimention():
    return render_template('two_d.html')
@app.route('/3d')
def threeDimention():
    return render_template('three_d.html')

@app.route('/formal-proof')
def formalProof():
    return render_template("formal_proof.html")
@app.route('/layman-proof')
def laymanProof():
    return render_template("layman_proof.html")
@app.route('/instructions')
def instructions():
    return render_template("instructions.html")

if __name__ == '__main__':
    app.run(debug=True, port= 5000)
