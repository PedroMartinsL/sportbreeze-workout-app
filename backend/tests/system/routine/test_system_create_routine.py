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
time.sleep(2)

routine_tab = driver.find_element(By.XPATH, "(//*[text()='Routine'])[last()]")
routine_tab.click()
time.sleep(2)

routine_name_input = "Tata ta malhando"

routine_name = driver.find_element(By.XPATH, "//input[@placeholder='Routine Name']")
routine_name.send_keys(routine_name_input)

schedule_workout = driver.find_element(By.XPATH, "(//*[text()='Schedule Routine'])[last()]")
schedule_workout.click()
time.sleep(12)

routine_week = driver.find_element(By.XPATH, f"(//*[text()='{routine_name_input}'])[last()]")
routine_week.click()
time.sleep(5)

workout_day = driver.find_element(By.XPATH, "(//*[text()='Monday'])[last()]")
workout_day.click()
time.sleep(5)

