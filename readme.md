# Análisis de datos

## Gzip

#### Info sin gzip
[![Captura-de-pantalla-243.png](https://i.postimg.cc/tCHJcbjr/Captura-de-pantalla-243.png)](https://postimg.cc/V5DzS35M)

#### Info con gzip (con compresión)
[![Captura-de-pantalla-242.png](https://i.postimg.cc/qBKgQR9h/Captura-de-pantalla-242.png)](https://postimg.cc/mhbbgbZB)


## Pruebas con Artillery

#### Con console.log 
[![Con-log.png](https://i.postimg.cc/9QjS6x8t/Con-log.png)](https://postimg.cc/PP22ZMkP)

#### Sin console.log
[![Sin-log.png](https://i.postimg.cc/kXSzhrcg/Sin-log.png)](https://postimg.cc/YhpdhsZ5)


## Pruebas con Autocannon y 0x

#### Con console.log 
[![0x-Con-log.png](https://i.postimg.cc/bvy5JZjZ/0x-Con-log.png)](https://postimg.cc/mPnjp2k4)

#### Sin console.log
[![0x-Sin-log.png](https://i.postimg.cc/P5zcTm0G/0x-Sin-log.png)](https://postimg.cc/4Yyw1hJw)


> Como conclusión podemos informar que la compresión de gzip disminuye el tamaño del cuerpo de respuesta haciendo que la aplicación web funcione mejor y más rápido (por más que sea una request simple como la de /info e /infoZip)

> Por otro lado, gracias a Artillery y a Autocannon y 0x, comprobamos que los console.log hacen que el tiempo de respuesta sea mayor y alentan nuestra aplicación web 