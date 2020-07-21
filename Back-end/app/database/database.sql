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
    fechainicio datetime not null,
    fechatermino datetime not null,
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


