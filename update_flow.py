with open("public/index.html", "r") as f:
    content = f.read()

# Actualizar logica para sincronizar Monitoreo y lista desplegable
if 'function registrarEntrega' in content:
    print("El script ya contiene las funciones base.")

