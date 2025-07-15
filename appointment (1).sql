-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2025 at 10:30 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appointment`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointment-details`
--

CREATE TABLE `appointment-details` (
  `id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `PositionTitle` varchar(100) NOT NULL,
  `SchoolOffice` varchar(255) DEFAULT NULL,
  `District` varchar(255) NOT NULL,
  `StatusOfAppointment` varchar(255) DEFAULT NULL,
  `NatureAppointment` varchar(100) NOT NULL,
  `ItemNo` varchar(100) NOT NULL,
  `DateSigned` date DEFAULT NULL,
  `pdfPath` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `appointment-releases`
--

CREATE TABLE `appointment-releases` (
  `id` int(11) NOT NULL,
  `appointmentId` int(11) NOT NULL,
  `releasedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `district`
--

CREATE TABLE `district` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `district`
--

INSERT INTO `district` (`id`, `name`) VALUES
(1, 'Basud'),
(2, 'Capalonga'),
(3, 'Daet North'),
(4, 'Daet South'),
(5, 'Jose Panganiban East'),
(6, 'Jose Panganiban West'),
(7, 'Labo East'),
(8, 'Labo West'),
(9, 'Mercedes'),
(10, 'Paracale'),
(11, 'Sta. Elena'),
(12, 'San Vicente - San Lorenzo Ruiz'),
(13, 'Vinzons'),
(14, 'Talisay'),
(17, 'SDO');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `uid` int(123) NOT NULL,
  `office` varchar(123) NOT NULL,
  `fullname` varchar(50) NOT NULL,
  `positionTitle` varchar(50) NOT NULL,
  `Initial` varchar(12312) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`uid`, `office`, `fullname`, `positionTitle`, `Initial`) VALUES
(1102, 'Office of the SDS', 'Crestito M. Morcilla, CESO V', 'Schools Division Superintendent', ''),
(1103, 'Office of the SDS', 'Jean-Paul Arnel M. Abejero', 'Administrative Assistant III', 'JA'),
(1104, 'Office of the SDS', 'Julius Andrew G. Salen', 'Administrative Aide VI', 'JAS'),
(1105, 'Office of the SDS', 'Rojan Markdave C. Anda', 'Administrative Aide IV', 'RMA'),
(1106, 'Office of the SDS', 'Charlie N. Conde, Jr.', 'Administrative Aide I (Casual)', 'CC'),
(1107, 'Office of the SDS', 'Nikko N. Salva', 'Administrative Aide I (Casual)', 'NS'),
(1108, 'Office of the ASDS', 'Joel E. Caolboy', 'Assistant Schools Division Superintendent', 'JC'),
(1109, 'Office of the ASDS', 'Maria Bernadeth A. Zamudio', 'Administrative Assistant III', 'MBZ'),
(1110, 'Office of the ASDS', 'Jovelyn A. Gerio', 'Project Development Officer I (Elem)', 'JG'),
(1111, 'ICT Section', 'Jay L. Dela Torre', 'Information Technology Officer', 'JD'),
(1112, 'ICT Section', 'Armie Joy A. Abdon', 'Administrative Officer II (Elem)', 'AJA'),
(1113, 'ICT Section', 'Kurt Joshua L. Vivas', 'Administrative Aide I (Job Order)', 'KV'),
(1114, 'Administrative Section', 'Antonio C. Ahmad', 'Administrative Officer V', 'AA'),
(1115, 'Administrative Section', 'Antonio T. Manlangit Jr.', 'Administrative Assistant III', 'AM'),
(1116, 'Administrative Section', 'Shakeel D. Delos Santos', 'Administrative Aide III', 'SD'),
(1117, 'Security Guards', 'Jesus A. Sentin', 'Security Guard I', 'Bong'),
(1118, 'Security Guards', 'Gomer P. Malate', 'Security Guard I', 'GM'),
(1119, 'Security Guards', 'Francis Y. Pabia', 'Administrative Aide I', 'FP'),
(1120, 'Utility (OSDS)', 'Jesus R. Villafuerte', 'Administrative Aide I', 'JV'),
(1121, 'Utility (OSDS)', 'Jerson D. Sentin', 'Administrative Aide I (Casual)', 'JSentin'),
(1122, 'Utility (OSDS)', 'Darell E. Bustamante', 'Administrative Aide I (Job Order)', 'DB'),
(1123, 'Human Resource Management Section', 'Syrel C. Talento', 'Administrative Officer IV', 'ST'),
(1124, 'Human Resource Management Section', 'Xyrone Zak M. Abejero', 'Administrative Assistant III', 'XA'),
(1125, 'Human Resource Management Section', 'Henry A. Ilagan', 'Administrative Assistant III', 'HI'),
(1126, 'Human Resource Management Section', 'Josephine G. Balce', 'Administrative Assistant III', 'JBalce'),
(1127, 'Human Resource Management Section', 'Rhea M. Asutilla', 'Administrative Assistant III', 'RA'),
(1128, 'Human Resource Management Section', 'Rodelio A. Vera Jr.', 'Administrative Assistant II', 'RV'),
(1129, 'Human Resource Management Section', 'Donn Voyd V. Villa', 'Administrative Assistant II', 'DV'),
(1130, 'Human Resource Management Section', 'May P. Langit', 'Administrative Officer II (Elem)', 'MLangit'),
(1131, 'Human Resource Management Section', 'Mercedes R. Raviz', 'Administrative Aide VI', 'MRaviz'),
(1132, 'Human Resource Management Section', 'Misael A. Vera', 'Administrative Aide VI', 'MVera'),
(1133, 'Human Resource Management Section', 'Allan Joy Z. Lee', 'Administrative Aide II', 'AL'),
(1134, 'Human Resource Management Section', 'Myrna M. Abat', 'Administrative Aide I', 'MA'),
(1135, 'Human Resource Management Section (PSU)', 'Alvin B. San Pascual', 'Administrative Officer II', 'AS'),
(1136, 'Human Resource Management Section (PSU)', 'Astrid A. Flores', 'Administrative Assistant III', 'AF'),
(1137, 'Human Resource Management Section (PSU)', 'Aldrin S. Puso', 'Administrative Officer II (Elem)', 'APuso'),
(1138, 'Human Resource Management Section (PSU)', 'Peter E. Mortega', 'Administrative Aide I', 'PM'),
(1139, 'Human Resource Management Section (PSU)', 'Mark Anthony R. Japa', 'Administrative Officer II (Elem)', 'MJ'),
(1140, 'Budget and Accounting Section', 'Marie L. Landagan', 'Administrative Officer V', 'ML'),
(1141, 'Budget and Accounting Section', 'Farrah Joanne P. Mendoza', 'Administrative Assistant III', 'FM'),
(1142, 'Budget and Accounting Section', 'Manette D. Grutas', 'Administrative Assistant I', 'MGrutas'),
(1143, 'Budget and Accounting Section', 'Dave Russel L. Gomez', 'Administrative Aide I (Casual)', 'DG'),
(1144, 'Accounting', 'Jerson G. Heraldo', 'Accountant III', 'JH'),
(1145, 'Accounting', 'Maria Theresa D. Andaya', 'Administrative Assistant III', 'MTA'),
(1146, 'Accounting', 'Maria Elena C. Resultay', 'Administrative Assistant III', 'MER'),
(1147, 'Accounting', 'Rowena C. Obusan', 'Administrative Assistant III', 'RO'),
(1148, 'Accounting', 'Benjo Mar C. Serame', 'Administrative Assistant III', 'BS'),
(1149, 'Accounting', 'Thea May A. Guevarra', 'Administrative Assistant III', 'TG'),
(1150, 'Accounting', 'Edgar Fanie Cañeba', 'Senior Bookkeeper', 'EFC'),
(1151, 'Accounting', 'Emma A. Carranceja', 'Senior Bookkeeper', 'EC'),
(1152, 'Accounting', 'Lily Rose O. Monte', 'Senior Bookkeeper', 'LRM'),
(1153, 'Accounting', 'Rainer Roland B. Zenarosa', 'Senior Bookkeeper', 'RZ'),
(1154, 'Accounting', 'Arlene G. Zenarosa', 'Senior Bookkeeper', 'AZ'),
(1155, 'Accounting', 'Melissa N. Zapata', 'Senior Bookkeeper', 'MZ'),
(1156, 'Accounting', 'Zyra Mae A. Davillo', 'Senior Bookkeeper', 'ZD'),
(1157, 'Accounting', 'Cristina N. Avanceña', 'Senior Bookkeeper', 'CA'),
(1158, 'Accounting', 'Mercy B. Casiano', 'Senior Bookkeeper', 'MC'),
(1159, 'Accounting', 'Christian Michael E. Talla', 'Senior Bookkeeper', 'CT'),
(1160, 'Accounting', 'Glen E. Talla', 'Senior Bookkeeper', 'GT'),
(1161, 'Accounting', 'Mary Joy A. Dioneda', 'Senior Bookkeeper', 'MD'),
(1162, 'Accounting', 'Mark Daryl J. Lomallo', 'Administrative Aide I', 'MDL'),
(1163, 'Accounting', 'Shiela D. Sumangid', 'Administrative Aide I', 'SS'),
(1164, 'Accounting', 'Aldrin S. Guinto', 'Administrative Aide I (Casual)', 'AG'),
(1165, 'Records Section', 'Alfredo R. Saspa Jr.', 'Administrative Officer IV', 'ASaspa'),
(1166, 'Records Section', 'Floyd Wilfred T. Pandes', 'Administrative Aide I', 'FWP'),
(1167, 'Records Section', 'Donabel P. Salenillas', 'Administrative Aide I', 'DS'),
(1168, 'Records Section', 'Romnick A. Esturas', 'Administrative Aide I (Casual)', 'RE'),
(1169, 'Cashier Section', 'Victoria M. Glodoviza', 'Administrative Officer IV', 'VG'),
(1170, 'Cashier Section', 'Emerlyn P. Dormitorio', 'Administrative Aide VI', 'ED'),
(1171, 'Cashier Section', 'Erma T. Tumala', 'Administrative Aide I (Casual)', 'ET'),
(1172, 'Supply Section', 'Mary Ann C. Manalo', 'Administrative Officer IV', 'MM'),
(1173, 'Supply Section', 'Minerva S. Inciong', 'Administrative Aide VI', 'MI'),
(1174, 'Supply Section', 'Edwin L. Salagoste', 'Administrative Aide I', 'ES'),
(1175, 'Supply Section', 'Beverly C. Anda', 'Administrative Aide I', 'BA'),
(1176, 'Supply Section', 'Tristan John C. Manalo', 'Administrative Officer II (Elem)', 'TM'),
(1177, 'Supply Section', 'Noemie D. Asis', 'Administrative Aide I (Casual)', 'NA'),
(1178, 'Legal Section', 'Kimberly A. Israel', 'Attorney III', 'KI'),
(1179, 'Legal Section', 'Charisse Jane C. Jumarito', 'Administrative Aide I (Casual)', 'CJ'),
(1180, 'Legal Section', 'Maridel B. Babagay', 'Administrative Aide I (Job Order)', 'MBabagay'),
(1181, 'CID', 'Emma T. Soriano', 'Chief Education Supervisor', 'ESoriano'),
(1182, 'CID', 'Aristotle S. Decena', 'Public Schools District Supervisor', 'ADecena'),
(1183, 'CID', 'Jane T. Ramirez', 'Public Schools District Supervisor', 'JR'),
(1184, 'CID', 'Renita B. Abraham', 'Public Schools District Supervisor', 'RAbraham'),
(1185, 'CID', 'Maria Felomina M. Saludes', 'Public Schools District Supervisor', 'MS'),
(1186, 'CID', 'Glenda N. Rito', 'Public Schools District Supervisor', 'GR'),
(1187, 'CID', 'Melissa M. Barbosa', 'Public Schools District Supervisor', 'MBarbosa'),
(1188, 'CID', 'Amorsolo R. Jamito', 'Public Schools District Supervisor', 'AJ'),
(1189, 'CID', 'Ruel T. Dominguez', 'Public Schools District Supervisor', 'RD'),
(1190, 'CID', 'Emelda A. Acuesta', 'Public Schools District Supervisor', 'EAcuesta'),
(1191, 'CID', 'Rez C. Salazar', 'Public Schools District Supervisor', 'RS'),
(1192, 'CID', 'Marcelino A. Ortua', 'Education Program Supervisor', 'MO'),
(1193, 'CID', 'Lourdes B. Mesa', 'Education Program Supervisor', 'LM'),
(1194, 'CID', 'Noel V. Ibis', 'Education Program Supervisor', 'NI'),
(1195, 'CID', 'Annie Lisa B. Satarain', 'Education Program Supervisor', 'ALS'),
(1196, 'CID', 'Wilma Joy M. Del Monte', 'Education Program Supervisor', 'WM'),
(1197, 'CID', 'Elisa E. Rieza', 'Education Program Supervisor', 'ER'),
(1198, 'CID', 'Nelson R. Gomez', 'Education Program Supervisor', 'NG'),
(1199, 'CID', 'Darcy Guy Y. Mañebo', 'Education Program Supervisor', 'DM'),
(1200, 'CID', 'Dario I. Cabanela', 'Education Program Supervisor', 'DC'),
(1201, 'CID', 'Nixon S. Olfindo', 'Education Program Supervisor', 'NO'),
(1202, 'CID', 'Lourdes G. Esguerra', 'Education Program Supervisor', 'LE'),
(1203, 'CID', 'Blesilda R. Panotes', 'Education Program Supervisor', 'BPanotes'),
(1204, 'CID', 'Amy B. Dumail', 'Education Program Supervisor', 'AD'),
(1205, 'CID', 'Jessalyn P. Malanyaon', 'Librarian II', 'JM'),
(1206, 'CID', 'Joan D. Naing', 'Project Development Officer II', 'JN'),
(1207, 'CID', 'Emilia L. Asis', 'Administrative Assistant III', 'EAsis'),
(1208, 'CID', 'Maribeth D. Gonzales', 'Administrative Aide VI', 'MG'),
(1209, 'Utility (CID)', 'Noel P. Asis', 'Administrative Aide I', 'NAsis'),
(1210, 'Utility (CID)', 'Jade T. Salen', 'Administrative Aide I', 'JS'),
(1211, 'SGOD Proper', 'Atty. Niño B. Raro', 'Chief Education Supervisor', 'AR'),
(1212, 'SGOD Proper', 'Rowena F. Zamudio', 'Education Program Supervisor', 'RF'),
(1213, 'SGOD Proper', 'Herbie B. De Lemios', 'Senior Education Program Specialist', 'HD'),
(1214, 'SGOD Proper', 'Maria Gracia E. Baluca', 'Senior Education Program Specialist', 'MB'),
(1215, 'SGOD Proper', 'Noel S. Rafael', 'Senior Education Program Specialist (HRD)', 'NRafael'),
(1216, 'SGOD Proper', 'Blesilda A. Necio', 'Senior Education Program Specialist', 'BN'),
(1217, 'SGOD Proper', 'Giovanni I. Asis', 'Planning Officer III', 'GA'),
(1218, 'SGOD Proper', 'Myla N. Deang', 'Education Program Specialist II', 'MJD'),
(1219, 'SGOD Proper', 'Alvin P. Panotes', 'Education Program Specialist II (HRD)', 'AP'),
(1220, 'SGOD Proper', 'Leusin Q. Alvarez', 'Education Program Specialist II', 'LA'),
(1221, 'SGOD Proper', 'Geronimo C. Burce Jr.', 'Project Development Officer II', 'GB'),
(1222, 'SGOD Proper', 'Blesilda V. Palmares', 'Project Development Officer I', 'BP'),
(1223, 'SGOD Proper', 'Edelen A. Arciga', 'Administrative Aide I', 'EA'),
(1224, 'SGOD Proper', 'Zandra A. Combiene', 'Administrative Officer II (Elem)', 'ZC'),
(1225, 'SGOD Proper', 'Venancio IV R. Despi', 'Administrative Aide I (Casual)', 'VD'),
(1226, 'SGOD Proper', 'Mark John P. Marco', 'Technical Assistant I (COS)', 'MJM'),
(1227, 'Education Facilities', 'Glen L. Dugan', 'Engineer III', 'GD'),
(1228, 'Education Facilities', 'Jeric P. Bautista', 'Senior Technical Assistant I/Project Engineer III ', 'JB'),
(1229, 'Health and Nutrition', 'Roly G. Abcede', 'Dentist II', 'RAbcede'),
(1230, 'Health and Nutrition', 'Jessica M. Pallon', 'Dentist II', 'JP'),
(1231, 'Health and Nutrition', 'Amy N. Vargas', 'Dentist II', 'AV'),
(1232, 'Health and Nutrition', 'Marilou O. Apuang', 'Nurse II', 'MApuang'),
(1233, 'Health and Nutrition', 'Melody A. Abando', 'Nurse II', 'MAbando'),
(1234, 'Health and Nutrition', 'Robbie Mark C. Bastro', 'Nurse II', 'RB'),
(1235, 'Health and Nutrition', 'Miriam L. Hernandez', 'Nurse II', 'MH'),
(1236, 'Health and Nutrition', 'Efren P. Hidalgo', 'Nurse II', 'FH'),
(1237, 'Health and Nutrition', 'Rene C. Ibasco', 'Nurse II', 'RI'),
(1238, 'Health and Nutrition', 'Christopherlyn Mary Jo-Ann L. Lee', 'Nurse II', 'CL'),
(1239, 'Health and Nutrition', 'Jay Joseph R. Magana', 'Nurse II', 'JJM'),
(1240, 'Health and Nutrition', 'Necelyn R. Romales', 'Nurse II', 'NR'),
(1241, 'Health and Nutrition', 'Eymard V. Yanto', 'Nurse II', 'EY'),
(1242, 'Health and Nutrition', 'Daisy Yanto', 'Nurse II', 'DY'),
(1243, 'Health and Nutrition', 'Chatt F. Mago', 'Nurse II', 'CM'),
(1244, 'Health and Nutrition', 'Leizel D. Pajarillo', 'Nurse II', 'LP'),
(1245, 'Health and Nutrition', 'Lerma S. Rubio', 'Nurse II', 'LR'),
(1246, 'Health and Nutrition', 'Cherrie D. Salcedo', 'Nurse II', 'CS'),
(1247, 'Health and Nutrition', 'Jasper C. Valeros', 'Nurse II', 'JValeros'),
(1248, 'Health and Nutrition', 'Carlito P. Abdon', 'Dental Aide', 'CAbdon'),
(1249, 'Health and Nutrition', 'Danilo B. Eboña', 'Dental Aide', 'DE'),
(1250, 'Health and Nutrition', 'Carlo P. Eboña', 'Dental Aide', 'CE'),
(1251, 'Health and Nutrition', 'Nydia R. Zenarosa', 'Administrative Aide II', 'NZ'),
(1252, 'COA-Detailed', 'Allan Ronald P. Maceda', 'Administrative Aide I', 'ARM'),
(1253, 'COA-Detailed', 'Melfa T. Racelis', 'Administrative Aide I', 'MR'),
(1254, 'COA-Detailed', 'Michelle P. Nual', 'Administrative Aide I', 'MN'),
(1255, 'COA-Detailed', 'Julie Ann J. Salo', 'Administrative Aide I (Job Order) IU', 'JSalo'),
(1256, 'COA-Detailed', 'Georgie Pereyra', 'Administrative Aide I (Job Order) IU', 'GP'),
(1257, 'CSC-Detailed', 'Maribeth V. Vera', 'Administrative Aide I', 'MV');

-- --------------------------------------------------------

--
-- Table structure for table `office`
--

CREATE TABLE `office` (
  `office` int(11) NOT NULL,
  `name` text NOT NULL,
  `district` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `schoolID` int(11) NOT NULL,
  `name` text NOT NULL,
  `districtID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`schoolID`, `name`, `districtID`) VALUES
(0, 'SDO CN', 17),
(112082, 'Angas ES', 1),
(112083, 'Balce ES', 1),
(112084, 'Basud ES', 1),
(112085, 'Briñas ES', 1),
(112086, 'Caayunan ES', 1),
(112087, 'Don Juan Pimentel ES', 1),
(112088, 'Fulgueras ES', 1),
(112089, 'Guinatungan ES', 1),
(112090, 'Hinampacan ES', 1),
(112091, 'Langa ES', 1),
(112092, 'Mampili ES', 1),
(112093, 'Mandazo ES', 1),
(112094, 'Mangcamagong ES', 1),
(112095, 'Matnog ES', 1),
(112096, 'Mocong ES', 1),
(112097, 'Oliva ES', 1),
(112099, 'Pedro S.Rada ES', 1),
(112100, 'Pinagwarasan ES', 1),
(112101, 'Plaridel ES', 1),
(112102, 'Primo R. Samonte ES', 1),
(112103, 'Saan Felipe ES', 1),
(112104, 'San Jose ES', 1),
(112105, 'Taba-Taba ES', 1),
(112106, 'Tacad ES', 1),
(112107, 'Tuaca ES', 1),
(112109, 'Camacho-Aler ES', 2),
(112110, 'Capalonga CS', 2),
(112111, 'Casiano Florendo ES', 2),
(112112, 'Jueves-Talento ES', 2),
(112113, 'Catalino Gonzales ES', 2),
(112114, 'Diezmo Urena ES', 2),
(112115, 'Esturas-Nabata ES', 2),
(112116, 'Francisco V. Aler ES', 2),
(112117, 'Lukbanan ES', 2),
(112118, 'Mabini ES', 2),
(112119, 'Marca-Murillo ES', 2),
(112120, 'Melquiades Caldit ES', 2),
(112121, 'Necio Olila ES', 2),
(112122, 'Peter Sawmill ES', 2),
(112123, 'Portugal-Chavez ES', 2),
(112124, 'Potenciano Juego ES', 2),
(112125, 'San Roque ES', 2),
(112126, 'Sotero Mago ES', 2),
(112127, 'Talento Roll ES', 2),
(112128, 'Torres Talento ES', 2),
(112129, 'Villa Aurora ES', 2),
(112130, 'A. Pabico-Abordo ES', 3),
(112131, 'Alawihao ES', 3),
(112132, 'Awitan ES', 3),
(112133, 'Bagasbas ES', 3),
(112134, 'Daet ES', 3),
(112135, 'Dogongan ES', 3),
(112136, 'Mantagbac ES', 3),
(112138, 'Pandan ES', 3),
(112139, 'UP Alawihao Resettlement ES', 3),
(112140, 'UP Teachers Village ES', 3),
(112141, 'Calasgasan ES', 4),
(112142, 'Cobangbang ES', 4),
(112143, 'San Luis ES', 4),
(112144, 'Don s. Carranceja MS', 4),
(112145, 'F. Baldovino ES', 4),
(112146, 'Goito Pimentel ES', 4),
(112147, 'Gregorio Pimentel MS', 4),
(112148, 'Zurbano ES', 4),
(112149, 'Calero ES', 5),
(112150, 'Calogcog ES', 5),
(112151, 'Jose Panganiban ES', 5),
(112153, 'Luna ES', 5),
(112154, 'Osmeña ES', 5),
(112155, 'Parang ES', 5),
(112156, 'San Mauricio ES', 5),
(112157, 'San Rafael ES', 5),
(112158, 'Segundo Aguirre ES', 5),
(112159, 'Roman V. Heraldo ES', 5),
(112160, 'D. Albonia ES', 6),
(112161, 'Dahican ES', 6),
(112162, 'Leon D. Bamba ES', 6),
(112163, 'Larap ES', 6),
(112164, 'Nakalaya ES', 6),
(112165, 'Pag-asa ES', 6),
(112166, 'San Isidro ES', 6),
(112167, 'San Jose ES', 6),
(112168, 'San Martin ES', 6),
(112169, 'San Pedro ES', 6),
(112170, 'Cresencia V. Envarga ES', 6),
(112171, 'Sta. Elena ES', 6),
(112172, 'Sta Milagrosa ES', 6),
(112173, 'Tawig ES', 6),
(112174, 'Ulipanan ES', 6),
(112175, 'V. Gabo ES', 6),
(112176, 'Baay ES', 7),
(112177, 'Bautista ES', 7),
(112178, 'Bayanbayan ES', 7),
(112179, 'Bulhao ES', 7),
(112180, 'Don Miguel Lukban ES', 7),
(112181, 'E. Obmaña ES', 7),
(112182, 'Fundado ES', 7),
(112183, 'G. Palado Sr. ES', 7),
(112184, 'Gavino Vinzons ES', 7),
(112185, 'L. Villamonte ES', 7),
(112186, 'Labo ES', 7),
(112187, 'Litordan ES', 7),
(112188, 'Mabilo ES', 7),
(112189, 'Malapat ES', 7),
(112190, 'Malasugui ES', 7),
(112191, 'Marcos Pimentel ES', 7),
(112192, 'Matanlang ES', 7),
(112193, 'Napaod ES', 7),
(112194, 'Pampang ES', 7),
(112195, 'Severino Francisco ES', 7),
(112196, 'Tulay na Lupa ES', 7),
(112197, 'Agapito Racelis ES', 8),
(112198, 'G.Zabala-B.Placido ES', 8),
(112199, 'Bagong Silang II ES', 8),
(112200, 'Bagong Silang III ES', 8),
(112201, 'Bayabas ES', 8),
(112203, 'G cale ES', 8),
(112204, 'F. Caudilla ES', 8),
(112205, 'Claudio Villagen ES', 8),
(112206, 'Daguit ES', 8),
(112208, 'Felix Asis ES', 8),
(112209, 'Florence ES', 8),
(112211, 'Kabungahan ES', 8),
(112212, 'Kanapawan ES', 8),
(112213, 'Macogon ES', 8),
(112214, 'Mahawan-hawan ES', 8),
(112215, 'Cleofas R. Dando ES', 8),
(112216, 'Malatap ES', 8),
(112218, 'Malibago ES', 8),
(112219, 'Maligaya ES', 8),
(112221, 'Patag ES', 8),
(112222, 'Cayucyucan ES', 9),
(112224, 'F. P. Ibasco ES', 9),
(112225, 'Gaboc ES', 9),
(112227, 'Hinipaan ES', 9),
(112228, 'Lalawigan ES', 9),
(112229, 'Lanot ES', 9),
(112230, 'Lope Manlangit ES', 9),
(112231, 'Mambungalon ES', 9),
(112232, 'Manguisoc ES', 9),
(112233, 'Masalongsalong ES', 9),
(112234, 'Claro E. Ibasco ES', 9),
(112235, 'Mercedes ES', 9),
(112236, 'Pambuhan ES', 9),
(112237, 'Quinapaguian ES', 9),
(112238, 'San Roque ES', 9),
(112239, 'Tagongtong ES', 9),
(112240, 'Tarum ES', 9),
(112241, 'Alfonso Dasco ES', 10),
(112242, 'Batobalani ES', 10),
(112243, 'Calaburnay ES', 10),
(112244, 'Capacuan ES', 10),
(112245, 'Dagang ES', 10),
(112246, 'Dalnac ES', 10),
(112247, 'Gumaus ES', 10),
(112248, 'Igang ES', 10),
(112249, 'Labnig ES', 10),
(112250, 'Macolabo ES', 10),
(112251, 'Ignacio Español ES', 10),
(112252, 'Mampungo ES', 10),
(112253, 'Mateo Era ES', 10),
(112254, 'Paracale CS', 10),
(112255, 'Pedro V. Moreno ES', 10),
(112256, 'Pinagbirayan ES', 10),
(112257, 'S. Basilio ES', 10),
(112258, 'Sta Catalina ES', 10),
(112259, 'Tawig ES', 10),
(112260, 'Tugos ES', 10),
(112261, 'B.U.OLIS ES', 12),
(112263, 'Imelda ES', 12),
(112264, 'L. Opeda ES', 12),
(112265, 'Maisog ES', 12),
(112266, 'Mampurog ES', 12),
(112267, 'Manlimonsito ES', 12),
(112268, 'Pulantuna ES', 12),
(112269, 'Resettlement ES', 12),
(112270, 'S.Delos Santos ES', 12),
(112271, 'Salvacion Big ES', 12),
(112272, 'Salvacion ( S ) ES', 12),
(112273, 'San Isidro ES', 12),
(112274, 'San Ramon ES', 12),
(112275, 'San Vicente CS', 12),
(112276, 'v. Orendain ES', 12),
(112277, 'V. Ricafrente ES', 12),
(112278, 'Basiad ES', 11),
(112279, 'Bulala ES', 11),
(112280, 'Dygico ES', 11),
(112281, 'Earth\'s Bounty ES', 11),
(112282, 'M. Hebrado ES', 11),
(112283, 'Pulongguit-guit ES', 11),
(112284, 'R. Oquindo ES', 11),
(112285, 'Rizal ES', 11),
(112286, 'Salvacion ES', 11),
(112287, 'San Pedro ES', 11),
(112289, 'F. David ES', 14),
(112290, 'Gabon ES', 14),
(112291, 'M. Cacho ES', 14),
(112292, 'R. Magsaysay ES.', 14),
(112293, 'San Isidro ES', 14),
(112294, 'Sta. Cruz ES', 14),
(112295, 'Sta. Elena ES', 14),
(112296, 'Talisay ES', 14),
(112297, 'Zantua Abordo ES', 14),
(112298, 'Banocboc ES', 13),
(112299, 'Cagbalogo ES', 13),
(112300, 'Calangcawan Norte ES', 13),
(112301, 'Calangcawan Sur ES', 13),
(112302, 'Don Miguel Lukban ES', 13),
(112303, 'El Trino P. Zenarosa ES', 13),
(112304, 'Gregorio Jardin ES', 13),
(112305, 'Gorgonio Obusan ES', 13),
(112306, 'Guinacutan ES', 13),
(112307, 'Juanito Balon ES', 13),
(112309, 'Mangcayo ES', 13),
(112310, 'Matango ES', 13),
(112311, 'Menandro Guinto ES', 13),
(112312, 'P. Barbin ES', 13),
(112314, 'Sto Domingo ES', 13),
(112315, 'Trino P.Zenarosa ES', 13),
(112316, 'Vinzons Pilot ES', 13),
(137126, 'Katutubo ES', 10),
(137206, 'Binatagan ES', 1),
(137207, 'Primitiva Flores Obusan ES', 1),
(173001, 'Don Emiliano L. Pabico ES', 3),
(173002, 'Julia B. Abilgos ES', 3),
(173003, 'Cabanbanan ES', 12),
(173004, 'Cahabaan ES', 14),
(173005, 'Guitol ES', 11),
(173006, 'Patag Ibaba ES', 11),
(173007, 'Patag Ilaya ES', 11),
(173008, 'Don Tomas ES', 11),
(173009, 'Juan Amparo ES', 11),
(173010, 'Kagtalaba ES', 11),
(173011, 'Maulawin ES', 11),
(173012, 'Tabugon ES', 11),
(173013, 'Dancalan ES', 10),
(173014, 'Villa San Isidro ES', 11),
(173015, 'Mancruz ES', 4),
(173017, 'Bagumbayan ES', 10),
(173018, 'Paciano A. Magana ES', 3),
(173019, 'Anita V. Romero ES', 4),
(173020, 'Palanas ES', 10),
(301886, 'Bagong Silang 1 High School', 8),
(301887, 'Bagong Silang II High School', 8),
(301888, 'E.P Borja High School', 11),
(301889, 'Basud NHS', 1),
(301890, 'Batobalani NHS', 10),
(301892, 'D.Q.Liwag National High School', 13),
(301893, 'Daguit NHS', 8),
(301894, 'Labo Science and Technology HS', 7),
(301896, 'Gonzalo Aler National High School', 2),
(301897, 'Delia Diezmo High School', 2),
(301899, 'Labo National High School', 7),
(301900, 'Lalawigan National HS', 9),
(301902, 'Manguisoc National HS', 9),
(301904, 'Matango National HS', 13),
(301905, 'Mercedes High School', 9),
(301907, 'Pablo S. Villafuerte HS', 9),
(301908, 'Pag-Asa High School', 7),
(301909, 'Pambuhan National HS', 9),
(301910, 'Paracale NHS', 10),
(301911, 'Gumaus NHS', 10),
(301912, 'Tabas National High School', 10),
(301913, 'Rizal NHS', 11),
(301914, 'Sabang National High School', 13),
(301915, 'San Felipe NHS', 1),
(301917, 'Leocadio Alejo Entienza HS', 11),
(301918, 'San Roque National HS', 9),
(301921, 'Tigbinan National High School', 8),
(301922, 'Tulay Na Lupa NHS', 7),
(301923, 'Talobatib High School', 7),
(301925, 'Vinzons Pilot HS', 13),
(305631, 'San Antonio High School', 2),
(305770, 'Aniceta De Lara Pimentel HS', 7),
(305910, 'Anameam HS', 8),
(305947, 'Baay HS', 7),
(306067, 'Dominador G. Mendoza HS', 11),
(306068, 'Capalonga NHS', 2),
(309602, 'Maulawin National High School', 11),
(309603, 'Caringo High School', 9),
(309604, 'Eugenia Morana-Quintela Mem. HS', 13),
(309608, 'Tuaca HS', 1),
(309610, 'Victoria Tuacar High School', 2),
(309611, 'Dominador Narido High School', 1),
(309614, 'Magsaysay NHS', 2),
(309616, 'Bulala high school', 11),
(309618, 'San Pedro-Domingo Llarena HS', 11),
(309620, 'Sarah Jane Ferrer HS', 13),
(309621, 'Maximo Manarang HS', 10),
(500030, 'Moreno IS', 3),
(500156, 'Dumagmang IS', 8),
(500634, 'Sta. Elena IS', 11),
(500635, 'Palali IS', 8),
(500908, 'Calabasa IS', 8),
(500909, 'Kabatuhan IS', 8),
(501259, 'Malaya IS', 8),
(501271, 'Colasi IS', 9),
(501737, 'Pagsangahan IS', 1),
(501738, 'Calabaca IS', 2),
(502249, 'Pinagtigasan Calaguas IS', 13),
(502420, 'Mangcawayan Island IS', 13),
(502451, 'Hamoraon IS', 9),
(502676, 'Regino A. Yet IS', 5);

-- --------------------------------------------------------

--
-- Table structure for table `travelauthority`
--

CREATE TABLE `travelauthority` (
  `id` int(225) NOT NULL,
  `PositionDesignation` text NOT NULL,
  `Station` varchar(99) NOT NULL,
  `Purpose` text NOT NULL,
  `Host` varchar(255) NOT NULL,
  `sof` text DEFAULT NULL,
  `DatesFrom` date NOT NULL,
  `DatesTo` date NOT NULL,
  `Destination` text NOT NULL,
  `Area` varchar(255) NOT NULL,
  `employee_ID` int(123) DEFAULT NULL,
  `Attachment` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointment-details`
--
ALTER TABLE `appointment-details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ItemNo` (`ItemNo`);

--
-- Indexes for table `appointment-releases`
--
ALTER TABLE `appointment-releases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointmentId` (`appointmentId`);

--
-- Indexes for table `district`
--
ALTER TABLE `district`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `office`
--
ALTER TABLE `office`
  ADD PRIMARY KEY (`office`),
  ADD KEY `district` (`district`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`schoolID`),
  ADD KEY `schools_ibfk_1` (`districtID`);

--
-- Indexes for table `travelauthority`
--
ALTER TABLE `travelauthority`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_employee` (`employee_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointment-details`
--
ALTER TABLE `appointment-details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1184;

--
-- AUTO_INCREMENT for table `appointment-releases`
--
ALTER TABLE `appointment-releases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `district`
--
ALTER TABLE `district`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `uid` int(123) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1259;

--
-- AUTO_INCREMENT for table `travelauthority`
--
ALTER TABLE `travelauthority`
  MODIFY `id` int(225) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointment-releases`
--
ALTER TABLE `appointment-releases`
  ADD CONSTRAINT `appointment-releases_ibfk_1` FOREIGN KEY (`appointmentId`) REFERENCES `appointment-details` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `office`
--
ALTER TABLE `office`
  ADD CONSTRAINT `office_ibfk_1` FOREIGN KEY (`district`) REFERENCES `district` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `schools`
--
ALTER TABLE `schools`
  ADD CONSTRAINT `schools_ibfk_1` FOREIGN KEY (`districtID`) REFERENCES `district` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `travelauthority`
--
ALTER TABLE `travelauthority`
  ADD CONSTRAINT `fk_employee` FOREIGN KEY (`employee_ID`) REFERENCES `employee` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
