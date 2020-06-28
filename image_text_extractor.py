from PIL import Image
import pytesseract
import os


from docx import Document
import re

def image_extract():
    file_dir = os.getcwd()
    directory = 'resumes/'
    for file in os.listdir(directory):
            if file.endswith(".jpg") | file.endswith(".jpeg") | file.endswith(".png") :
                full_path = os.path.join(directory, file)

                im = Image.open(full_path)
                file_text = pytesseract.image_to_string(im, lang = 'eng')
                
                text_file_name = "resumes/" + str(file) + ".txt"
                word_file_name = "resumes/" + str(file) + ".docx"
                with open(text_file_name, "a") as f:
                    f.write(file_text + "\n")

                for i in os.listdir(directory):
                    document = Document()

                    myfile = open(text_file_name).read()
                    myfile = re.sub(r'[^\x00-\x7F]+|\x0c',' ', myfile) # remove all non-XML-compatible characters
                    p = document.add_paragraph(myfile)
                    document.save(word_file_name)
                    os.remove(text_file_name)

                    return word_file_name
