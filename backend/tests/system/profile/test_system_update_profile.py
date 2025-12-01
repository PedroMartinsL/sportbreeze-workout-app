# Importa o módulo principal do Selenium para controlar navegadores
from selenium import webdriver

# Importa o tipo de localização de elementos (por nome, id, xpath etc.)
from selenium.webdriver.common.by import By

# Permite configurar o caminho e inicialização do ChromeDriver
from selenium.webdriver.chrome.service import Service

# Ferramenta do Selenium para esperar eventos na página
from selenium.webdriver.support.ui import WebDriverWait

# Conjunto de condições prontas para usar durante esperas (ex: título conter texto)
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options  # Configurações do Chrome

import time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

driver.get("http://localhost:8081/")
time.sleep(1)

# Procura pelo texto exato "Sign in"
botao = driver.find_element(By.XPATH, "//*[text()='Sign in']")
botao.click()
time.sleep(1)

# Campo de email
email = driver.find_element(By.XPATH, "//input[@placeholder='email@example.com']")
email.send_keys("pedromartinsdelemos@gmail.com")
time.sleep(1)

# Campo de senha
senha = driver.find_element(By.XPATH, "//input[@type='password']")
senha.send_keys("Pedro123")
time.sleep(1)

botao_login = driver.find_element(By.XPATH, "(//*[text()='Sign in'])[last()]")
botao_login.click()
time.sleep(2 )

# AGE
age = driver.find_element(By.XPATH, "//input[@placeholder='e.g., 22']")
age.clear()
age.send_keys("25")

# WEIGHT
weight = driver.find_element(By.XPATH, "//input[@placeholder='e.g., 70']")
weight.clear()
weight.send_keys("80")

# HEIGHT
height = driver.find_element(By.XPATH, "//input[@placeholder='e.g., 175']")
height.clear()
height.send_keys("178")

# HOURS PER DAY
hours = driver.find_element(By.XPATH, "//input[@placeholder='e.g., 2']")
hours.clear()
hours.send_keys("3")
time.sleep(1)

# SPORTS
driver.find_element(By.XPATH, "(//*[text()='Swimming'])[last()]").click()
driver.find_element(By.XPATH, "(//*[text()='Trail'])[last()]").click()
time.sleep(1)

# DAYS
for day in ["Sat", "Sun"]:
    driver.find_element(By.XPATH, f"//*[text()='{day}']").click()
time.sleep(1)

# SAVE PROFILE
save_button = driver.find_element(
    By.XPATH,
    "//text()[.='Save Profile']/parent::* | //text()[.='Update Profile']/parent::*"
)
save_button.click()
time.sleep(5)