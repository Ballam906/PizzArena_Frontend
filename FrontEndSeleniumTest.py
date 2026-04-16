from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
wait = WebDriverWait(driver, 12)

def pause(seconds=1.2):
    time.sleep(seconds)

def slow_scroll_to(y_target, step=120, delay=0.08):
    current_y = driver.execute_script("return window.pageYOffset;")

    if current_y < y_target:
        positions = range(int(current_y), int(y_target), step)
    else:
        positions = range(int(current_y), int(y_target), -step)

    for y in positions:
        driver.execute_script(f"window.scrollTo(0, {y});")
        time.sleep(delay)

    driver.execute_script(f"window.scrollTo(0, {y_target});")
    time.sleep(0.2)

def scroll_to_element(element, offset=-120):
    y = driver.execute_script(
        "const rect = arguments[0].getBoundingClientRect();"
        "return rect.top + window.pageYOffset + arguments[1];",
        element,
        offset
    )
    slow_scroll_to(y)

def safe_click(element):
    scroll_to_element(element)
    pause(0.4)
    driver.execute_script("arguments[0].click();", element)

def clear_and_type(element, text, delay=0.06):
    element.clear()
    pause(0.2)
    for char in text:
        element.send_keys(char)
        time.sleep(delay)

def wait_and_find(by, value):
    return wait.until(EC.presence_of_element_located((by, value)))

def wait_and_clickable(by, value):
    return wait.until(EC.element_to_be_clickable((by, value)))

try:
    driver.get("http://localhost:5173")
    driver.maximize_window()
    pause(2)

    rendeles_link = wait_and_clickable(By.LINK_TEXT, "Add le a rendelésed!")
    safe_click(rendeles_link)
    pause(1.5)

    reg_button = wait_and_clickable(By.XPATH, "//button[text()='Regisztráció']")
    safe_click(reg_button)
    pause(1.2)

    username_input = wait_and_find(By.XPATH, "//input[@placeholder='pl. Pizzafan123']")
    email_input = wait_and_find(By.XPATH, "//input[@placeholder='valami@gmail.com']")
    password_input = wait_and_find(By.XPATH, "//input[@placeholder='••••••••']")

    clear_and_type(username_input, "tesztuser4")
    clear_and_type(email_input, "teszt@email.com")
    clear_and_type(password_input, "Teszt123!")
    pause(1)

    reg_submit = wait_and_clickable(By.XPATH, "//form[@id='register-form']//button[@type='submit']")
    safe_click(reg_submit)
    pause(2)

    login_tab = wait_and_clickable(By.XPATH, "//button[text()='Bejelentkezés']")
    safe_click(login_tab)
    pause(1.2)

    login_username = wait_and_find(By.XPATH, "//input[@placeholder='pl. Pizzafan123']")
    login_password = wait_and_find(By.XPATH, "//input[@placeholder='••••••••']")

    clear_and_type(login_username, "tesztuser4")
    clear_and_type(login_password, "Teszt123!")
    pause(1)

    login_button = wait_and_clickable(By.XPATH, "//button[text()='Belépés']")
    safe_click(login_button)
    pause()

    categories = ["Pizza", "Levesek", "Desszertek"]

    for cat in categories:
        category_button = wait_and_clickable(By.XPATH, f"//button[text()='{cat}']")
        safe_click(category_button)
        pause(1.5)

        add_button = wait_and_clickable(By.XPATH, "//button[contains(text(),'Kosárba')]")
        safe_click(add_button)
        pause(1.5)

    kosar_button = wait_and_clickable(By.CLASS_NAME, "etlap-cart-link")
    safe_click(kosar_button)
    pause(2)

    restaurant_select = wait_and_find(By.XPATH, "//select[contains(@class,'kosar-form-input')]")
    nev_input = wait_and_find(By.XPATH, "//input[@placeholder='Név']")
    telefon_input = wait_and_find(By.XPATH, "//input[@placeholder='Telefonszám']")
    email_input = wait_and_find(By.XPATH, "//input[@placeholder='Email']")
    varos_input = wait_and_find(By.XPATH, "//input[@placeholder='Város']")
    iranyitoszam_input = wait_and_find(By.XPATH, "//input[@placeholder='Irányítószám']")
    utca_input = wait_and_find(By.XPATH, "//input[@placeholder='Utca, házszám']")
    egyeb_input = wait_and_find(By.XPATH, "//textarea[@placeholder='Egyéb (emelet, ajtó, kapukód, stb.)']")

    scroll_to_element(restaurant_select)
    pause(0.6)
    Select(restaurant_select).select_by_index(1)
    pause(1.2)

    clear_and_type(nev_input, "a")
    clear_and_type(telefon_input, "123")
    clear_and_type(email_input, "rosszemail")
    clear_and_type(varos_input, "x")
    clear_and_type(iranyitoszam_input, "11")
    clear_and_type(utca_input, "y")
    clear_and_type(egyeb_input, "teszt")
    pause(1)

    rendeles_button = wait_and_clickable(By.XPATH, "//button[contains(text(),'Rendelés leadása')]")
    safe_click(rendeles_button)
    pause(2)

    clear_and_type(nev_input, "Teszt Elek")
    clear_and_type(telefon_input, "06301234567")
    clear_and_type(email_input, "tesztelek@email.com")
    clear_and_type(varos_input, "Budapest")
    clear_and_type(iranyitoszam_input, "1117")
    clear_and_type(utca_input, "Teszt utca 12")
    clear_and_type(egyeb_input, "2. emelet, 5-ös ajtó")
    pause(1)

    safe_click(rendeles_button)
    pause(3)

    fiok_gomb = wait_and_clickable(By.LINK_TEXT, "Fiók")
    safe_click(fiok_gomb)
    pause(2)

    kijelentkezes_gomb = wait_and_clickable(By.XPATH, "//button[contains(text(),'Kijelentkez')]")
    safe_click(kijelentkezes_gomb)
    pause(2)

    print("A teszt lefutott.")

except Exception as e:
    print("Hiba:", e)
    driver.save_screenshot("error.png")

finally:
    time.sleep(2)
    driver.quit()