-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: estadisticas_rafael_moda_bbdd
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaigns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `expenses` decimal(10,2) DEFAULT NULL,
  `benefits` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES (1,'Campaña Invierno 2025','2025-01-01','2025-02-28',10000.00,20000.00),(2,'Campaña Primavera 2025','2025-03-01','2025-05-31',15000.00,25000.00),(3,'Campaña Verano 2025','2025-06-01','2025-08-31',20000.00,30000.00),(4,'Campaña Otoño 2025','2025-09-01','2025-11-30',12000.00,22000.00),(5,'Campaña Navidad 2025','2025-12-01','2025-12-31',18000.00,35000.00),(6,'Campaña Rebajas Invierno 2025','2025-01-15','2025-02-15',5000.00,15000.00),(7,'Campaña Día de San Valentín','2025-02-01','2025-02-14',3000.00,10000.00),(8,'Campaña Día del Padre 2025','2025-03-01','2025-03-19',4000.00,12000.00),(9,'Campaña Día de la Madre 2025','2025-04-01','2025-05-01',7000.00,15000.00),(10,'Campaña Verano de Ofertas 2025','2025-06-15','2025-07-31',16000.00,28000.00),(11,'Campaña Feria de Julio 2025','2025-07-01','2025-07-15',12000.00,22000.00),(12,'Campaña Fiesta de San Juan 2025','2025-06-20','2025-06-23',8000.00,18000.00),(13,'Campaña Black Friday 2025','2025-11-20','2025-11-27',25000.00,50000.00),(14,'Campaña Cyber Monday 2025','2025-11-30','2025-12-01',15000.00,40000.00),(15,'Campaña Primavera de Lujo 2025','2025-03-01','2025-04-30',20000.00,30000.00),(16,'Campaña Back to School 2025','2025-08-01','2025-09-15',10000.00,22000.00),(17,'Campaña Lluvia de Ofertas 2025','2025-09-01','2025-09-30',13000.00,24000.00),(18,'Campaña Halloween 2025','2025-10-01','2025-10-31',5000.00,15000.00),(19,'Campaña Navidad de Ofertas 2025','2025-12-01','2025-12-25',22000.00,45000.00),(20,'Campaña Año Nuevo 2025','2025-12-26','2025-12-31',15000.00,30000.00);
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `cp` varchar(10) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'Cliente Uno','28001','Madrid','Madrid'),(2,'Cliente Dos','08002','Barcelona','Barcelona'),(3,'Cliente Tres','46003','Valencia','Valencia'),(4,'Cliente Cuatro','41004','Sevilla','Sevilla'),(5,'Cliente Cinco','50005','Zaragoza','Zaragoza'),(6,'Cliente Seis','03006','Alicante','Alicante'),(7,'Cliente Siete','29007','Málaga','Málaga'),(8,'Cliente Ocho','15008','A Coruña','A Coruña'),(9,'Cliente Nueve','20009','Gipuzkoa','San Sebastián'),(10,'Cliente Diez','48010','Bizkaia','Bilbao'),(11,'Cliente Once','35011','Las Palmas','Las Palmas'),(12,'Cliente Doce','38012','Tenerife','Santa Cruz'),(13,'Cliente Trece','07013','Illes Balears','Palma'),(14,'Cliente Catorce','31014','Navarra','Pamplona'),(15,'Cliente Quince','33015','Asturias','Oviedo'),(16,'Cliente Dieciséis','14016','Córdoba','Córdoba'),(17,'Cliente Diecisiete','02017','Albacete','Albacete'),(18,'Cliente Dieciocho','16018','Cuenca','Cuenca'),(19,'Cliente Diecinueve','10019','Cáceres','Cáceres'),(20,'Cliente Veinte','37020','Salamanca','Salamanca');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model` varchar(50) DEFAULT NULL,
  `family` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` varchar(10) DEFAULT NULL,
  `pvd` decimal(10,2) DEFAULT NULL,
  `pvp` decimal(10,2) DEFAULT NULL,
  `units` int DEFAULT NULL,
  `discount` decimal(5,2) DEFAULT NULL,
  `profit` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,'Vaquero','Pantalón','Azul','M',20.00,40.00,2,0.00,40.00),(2,'Chino','Pantalón','Beige','L',18.00,36.00,1,10.00,18.40),(3,'Polo','Camiseta','Blanco','S',10.00,25.00,3,0.00,45.00),(4,'Blazer','Chaqueta','Negro','M',50.00,90.00,1,5.00,35.50),(5,'Cazadora','Chaqueta','Marrón','L',45.00,85.00,2,0.00,80.00),(6,'Sudadera','Camiseta','Gris','XL',15.00,35.00,4,20.00,64.00),(7,'Vaquero','Pantalón','Negro','S',21.00,42.00,1,0.00,21.00),(8,'Top','Camiseta','Rojo','M',8.00,20.00,2,5.00,22.80),(9,'Chino','Pantalón','Verde','XL',19.00,38.00,2,0.00,38.00),(10,'Blazer','Chaqueta','Azul Marino','M',52.00,95.00,1,15.00,33.65);
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seasons`
--

DROP TABLE IF EXISTS `seasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seasons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `expenses` decimal(10,2) NOT NULL,
  `benefits` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seasons`
--

LOCK TABLES `seasons` WRITE;
/*!40000 ALTER TABLE `seasons` DISABLE KEYS */;
INSERT INTO `seasons` VALUES (11,'Temporada de Invierno 2019-2020','2019-09-09','2020-03-12',10000.00,18000.00),(12,'Temporada de Verano 2020','2020-03-12','2020-09-09',9500.00,16000.00),(13,'Temporada de Invierno 2020-2021','2020-09-09','2021-03-12',11000.00,19000.00),(14,'Temporada de Verano 2021','2021-03-12','2021-09-09',9800.00,17000.00),(15,'Temporada de Invierno 2021-2022','2021-09-09','2022-03-12',12000.00,20000.00),(16,'Temporada de Verano 2022','2022-03-12','2022-09-09',10200.00,17500.00),(17,'Temporada de Invierno 2022-2023','2022-09-09','2023-03-12',13000.00,21000.00),(18,'Temporada de Verano 2023','2023-03-12','2023-09-09',10500.00,18000.00),(19,'Temporada de Invierno 2023-2024','2023-09-09','2024-03-12',13500.00,22000.00),(20,'Temporada de Verano 2024','2024-03-12','2024-09-09',11000.00,18500.00),(21,'Temporada de Invierno 2024-2025','2024-09-09','2025-03-12',14000.00,23000.00),(22,'Temporada de Verano 2025','2025-03-12','2025-09-09',11500.00,19000.00);
/*!40000 ALTER TABLE `seasons` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-13  0:01:32
