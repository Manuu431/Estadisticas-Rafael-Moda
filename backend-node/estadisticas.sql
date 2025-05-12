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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 23:36:05
