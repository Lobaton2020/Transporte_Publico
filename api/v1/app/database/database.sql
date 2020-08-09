create database transpublic;
use transpublic;

create table  rol (
    idrol int not null auto_increment, 
    nombre varchar(100) not null,
    primary key ( idrol )
);


create table  usuario (
    idusuario int not null auto_increment, 
    idrol int not null,
    nombrecompleto varchar(100) not null,
    correo varchar(50) not null,
    contrasena varchar(100) not null,
    imagen varchar(100) not null,
    telefono varchar(20) not null,
    primary key ( idusuario )
);

create table contrato (
    idcontrato int not null auto_increment, 
    idusuario int not null,
    fechainicio date not null,
    fechatermino date not null,
    empresa varchar(50) not null,
    valortotal float,
    primary key ( idcontrato ),
    foreign key ( idusuario ) references usuario ( idusuario )
);

create table bus (
    placa varchar(20) not null , 
    idusuario int not null,
    color varchar(50) not null,
    modelo varchar(10) not null,
    fabricante varchar(40) not null,
    primary key ( placa ),
    foreign key ( idusuario ) references usuario ( idusuario )
);


create table ruta (
    idruta int not null auto_increment, 
    nombre varchar(100) not null,
    lugarpartida varchar(100) not null,
    lugarllegada varchar(100) not null,
    primary key ( idruta )
);

create table rutabus (
    idruta int not null, 
    idbus varchar(20) not null,
    fechapartida datetime not null,
    fechallegada datetime not null,
    foreign key ( idruta ) references ruta ( idruta ),
    foreign key ( idbus ) references bus ( placa )
);


INSERT INTO `rol` (`idrol`, `nombre`) VALUES
(1, 'Coordinador Administrativo'),
(2, 'Coordinador de Rutas'),
(3, 'Conductor');

INSERT INTO `usuario` (`idusuario`, `idrol`, `nombrecompleto`, `correo`, `contrasena`, `imagen`, `telefono`) VALUES
(1, 1, 'admin', 'admin@admin.com', '$2y$10$CiQcUHWJd6VJlnglNYO8aed2RLhrqfflrypfYnOX05GVYdeU60.5K', 'images/auth/avatar.png', '000000000'),
(2, 2, 'coordinador', 'cordinador@cordinador.com', '$2y$10$9Um4EtGtozc44EFbAgqRseXeV9JE3J6UdXK2VA6XU8dLI5n1lSkca', 'auth/img/avatar.png', '0000000000'),
(3, 3, 'conductor1', 'conductor1@conductor.com', '$2y$10$92umf8S1jo4IG3NP.Oj7c.tqiGbOD7WQIv/TZ/GL8bYCAVtlEehFa', 'auth/img/avatar.png', '00000000'),
(4, 3, 'conductor2', 'conductor2@conductor.com', '$2y$10$92umf8S1jo4IG3NP.Oj7c.tqiGbOD7WQIv/TZ/GL8bYCAVtlEehFa', 'auth/img/avatar.png', '00000000'),
(5, 3, 'conductor3', 'conductor3@conductor.com', '$2y$10$92umf8S1jo4IG3NP.Oj7c.tqiGbOD7WQIv/TZ/GL8bYCAVtlEehFa', 'auth/img/avatar.png', '00000000');

INSERT INTO `ruta` (`idruta`, `nombre`, `lugarpartida`, `lugarllegada`) VALUES
(1, 'Jutumecop', 'Acacias', 'Villavicencio'),
(2, 'El viaje largo', 'Bogota', 'Villavicencio'),
(3, 'Los acacios', 'Bogota', 'La Calera'),
(4, 'Apaporis', 'Acacias', 'Florencia');


INSERT INTO `bus` (`placa`, `idusuario`, `color`, `modelo`, `fabricante`) VALUES
('ABC-345', 3, 'Amarillo', '1998', 'Marcopolo'),
('CSD345', 4, 'Negro', '2000', 'Toshiba'),
('FND-345', 5, 'Blanco', '2020', 'Ford');

INSERT INTO `contrato` (`idcontrato`, `idusuario`, `fechainicio`, `fechatermino`, `empresa`, `valortotal`) VALUES
(1, 2, '2010-12-02 12:45:31', '2020-02-12 12:45:34', 'Bancolombia', 28000000),
(2, 3, '2010-12-02 12:45:31', '2020-02-12 12:45:34', 'BBVA', 38000000),
(3, 4, '2010-12-02 12:45:31', '2020-02-12 12:45:34', 'Transpublic', 58000000),
(4, 5, '2010-12-02 12:45:31', '2020-02-12 12:45:34', 'Turixmó', 68000000);


