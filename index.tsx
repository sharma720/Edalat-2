/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';

// --- DATA STRUCTURES (Interfaces) ---
interface Student {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  phone1: string;
  phone2: string;
  grade: string;
  address: string;
  area: string;
  driverName: string;
}

interface Contract {
  id: number;
  studentName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
}

interface Payment {
  date: string;
  contractId: number;
  studentName: string;
  amount: number;
  trackingNumber: string;
  type: string;
}

interface Driver {
  id: number;
  name: string;
  phone: string;
  vehicleType: string;
  licensePlate: string;
  route: string;
  studentCount: number;
  salary: number;
}

// --- PARSED DATA ---
// NOTE: In a real application, this would come from a database or API.
const students: Student[] = [
    { id: 1, firstName: "آوا", lastName: "خسروان", fatherName: "احسان", phone1: "939669552", phone2: "9122773287", grade: "هشتم", address: "شهرک اکباتان فاز دو بلوک 16 ورودی یک", area: "شهرک اکباتان", driverName: "غلامرضا مرادی" },
    { id: 2, firstName: "نیکا", lastName: "گلاوی", fatherName: "پیمان", phone1: "9128993267", phone2: "2144040467", grade: "هشتم", address: "بلوارجناح جنوب روبروی بلوارگلاب بن بست گوهری مهر مجتمع نوید بلوک B", area: "بلوار فردوس شرق", driverName: "جهانگیر قاسمی" },
    { id: 3, firstName: "حلما", lastName: "اسماعیل آبادی", fatherName: "حمید", phone1: "9125130690", phone2: "9197672851", grade: "هشتم", address: "کوی بیمه خیابان بیمه دوم", area: "کوی بیمه", driverName: "مریم توفیق پیروز" },
    { id: 4, firstName: "مارال", lastName: "رضایی", fatherName: "عبدالحمید", phone1: "9036205674", phone2: "9036205674", grade: "هشتم", address: "بلوار فردوس شرق خیابان ولیعصر کوچه دوازده متری هشتم پلاک 3", area: "بلوار فردوس شرق", driverName: "جهانگیر قاسمی" },
    { id: 5, firstName: "روشا", lastName: "صدری کیا", fatherName: "حمیدرضا", phone1: "9125239856", phone2: "9354365901", grade: "هفتم", address: "بلوار فردوس شرق خیابان ولیعصر کوچه دوازده متری هشتم پلاک 3", area: "بلوار فردوس شرق", driverName: "جهانگیر قاسمی" },
    { id: 6, firstName: "ستاره", lastName: "آزاد", fatherName: "آرش", phone1: "9944996061", phone2: "9126022336", grade: "هشتم", address: "بلوار فردوس شرق خیابان قبادی، ظرافتی مرکزی پلاک 52", area: "بلوار فردوس شرق", driverName: "جهانگیر قاسمی" },
    { id: 7, firstName: "آندیا", lastName: "دارابی", fatherName: "نعمت الله", phone1: "9916118509", phone2: "9128573026", grade: "هفتم", address: "بلوار فردوس شرق خیابان ولیعصر دوازده متری ولیعصر هفتم پلاک 22", area: "بلوار فردوس شرق", driverName: "آذر قاسمی" },
    { id: 8, firstName: "صبا", lastName: "محمودی", fatherName: "حمزه", phone1: "9915666412", phone2: "9196115922", grade: "هفتم", address: "بلوار فردوس شرق خیابان ولیعصر خیابان باقری شرقی پلاک 12 واحد 9", area: "بلوار فردوس شرق", driverName: "آذر قاسمی" },
    { id: 9, firstName: "دنیا", lastName: "تویسرکانی", fatherName: "غلامرضا", phone1: "9126184118", phone2: "9121712417", grade: "هفتم", address: "کوی بیمه خیابان فلسفی کوچه نیکنام", area: "کوی بیمه", driverName: "مریم توفیق پیروز" },
    { id: 10, firstName: "آرنیکا", lastName: "عابدینی", fatherName: "عماد", phone1: "9121460373", phone2: "9123902623", grade: "هشتم", address: "شهرک اکباتان فاز دو بلوک 16 ورودی دو واحد 150", area: "شهرک اکباتان", driverName: "غلامرضا مرادی" },
    { id: 11, firstName: "یلدا", lastName: "محمد صلاحی", fatherName: "ناصر", phone1: "9122771021", phone2: "9120311892", grade: "هشتم", address: "شهرک اکباتان فاز دو بلوک 9 ورودی دو واحد236", area: "شهرک اکباتان", driverName: "غلامرضا مرادی" },
    { id: 12, firstName: "رونیکا", lastName: "خلجانی", fatherName: "ولی", phone1: "9195584165", phone2: "9908361045", grade: "هشتم", address: "بلوار فردوس غرب خیابان لاله جنوبی نبش 18متری شرقی پلاک 19 واحد 25", area: "بلوار فردوس غرب", driverName: "حاجی باقری" },
    { id: 13, firstName: "عسل", lastName: "عصارین", fatherName: "بهنام", phone1: "9121399661", phone2: "2144652104", grade: "نهم", address: "شهرک اکباتان فاز سه بلوک E1 ورودی 6 واحد 180", area: "شهرک اکباتان", driverName: "غلامرضا مرادی" },
    { id: 14, firstName: "صهبا", lastName: "زارعی", fatherName: "حمید", phone1: "9127134903", phone2: "9126785198", grade: "نهم", address: "بلوار فردوس شرق خیابان سلیمی جهرمی جنوبی ، خیابان سنبل شرقی پلاک 7  واحد 6", area: "بلوار فردوس شرق", driverName: "آذر قاسمی" },
    { id: 15, firstName: "روژینا", lastName: "سلیمان حشمتی", fatherName: "عزیز", phone1: "91212433202", phone2: "9123463397", grade: "هفتم", address: "بلوار فردوس شرق خیابان جناح خیابان طاهریان خیابان ارغوان خیابان چهارم پلاک 26 واحد 1", area: "بلوار فردوس شرق", driverName: "آذر قاسمی" },
    { id: 16, firstName: "باران", lastName: "ابراهیمی", fatherName: "کیوان", phone1: "9107853441", phone2: "9123936027", grade: "نهم", address: "فردوس غرب منوچهری غربی کوچه آپادانا پلاک 5 واحد 15", area: "بلوار فردوس غرب", driverName: "حاجی باقری" },
    { id: 17, firstName: "ستایش", lastName: "یحیائی", fatherName: "علیرضا", phone1: "9126872665", phone2: "9126872665", grade: "نهم", address: "بلوار فردوس غرب پروانه جنوبی کوچه 35 پلاک 20 واحد یک", area: "بلوار فردوس غرب", driverName: "حاجی باقری" },
    { id: 18, firstName: "آسمان", lastName: "نعمتی", fatherName: "", phone1: "9398284841", phone2: "9125775542", grade: "هشتم", address: "فردوس غرب  خیابان پروانه جنوبی کوچه بیست و یکم پلاک 26  طبقه پنجم", area: "بلوار فردوس غرب", driverName: "حاجی باقری" },
    { id: 19, firstName: "سوریا", lastName: "عیدی زاده", fatherName: "محمد", phone1: "9126721726", phone2: "9133233228", grade: "نهم", address: "شهرک اکباتان فاز دو بلوک پنج واحد 2036", area: "شهرک اکباتان", driverName: "غلامرضا مرادی" },
    { id: 20, firstName: "ترنم", lastName: "کوشکی", fatherName: "هومن", phone1: "9166610887", phone2: "9124398417", grade: "نهم", address: "بیمه سوم نبش کوچه 12 جنب پارک پلاک17واحد 10", area: "کوی بیمه", driverName: "مریم توفیق پیروز" },
    { id: 21, firstName: "سوگند", lastName: "کربلایی", fatherName: "", phone1: "9126449289", phone2: "9121720728", grade: "نهم", address: "شهرک اکباتان فاز دو بلوک 14 ورودی سه", area: "شهرک اکباتان", driverName: "غلامرضا مرادی" },
    { id: 22, firstName: "گیسو", lastName: "فیاض", fatherName: "بابک", phone1: "9122475512", phone2: "9128102629", grade: "هشتم", address: "شهرک اکباتان فاز دو بلوک 10 ورودی یک واحد 104", area: "شهرک اکباتان", driverName: "غلامرضا مرادی" },
    { id: 23, firstName: "مهرسا", lastName: "افرایی", fatherName: "امیر", phone1: "9123151838", phone2: "9192696213", grade: "هشتم", address: "کوی بیمه انتهای بیمه چهارم  خیابان آراسته صفت ساختمان پارسا پلاک 162  واحد 9", area: "کوی بیمه", driverName: "مریم توفیق پیروز" },
    { id: 24, firstName: "رز", lastName: "خدیوی زند", fatherName: "محسن", phone1: "9021011841", phone2: "9129250213", grade: "هشتم", address: "شهرک اکباتان فاز دو بلوک 6 ورودی 58", area: "شهرک اکباتان", driverName: "غلامرضا مرادی" },
    { id: 25, firstName: "بهینا", lastName: "قپانوری", fatherName: "محمد", phone1: "9192406202", phone2: "9192406202", grade: "نهم", address: "شهرک اکباتان فاز دو بلوک یک ورودی یک", area: "شهرک اکباتان", driverName: "غلامرضا مرادی" },
    { id: 26, firstName: "تامای", lastName: "گنجی زاده", fatherName: "مهران", phone1: "9126467560", phone2: "9128343712", grade: "هفتم", address: "شهرک اکباتان فاز یک بلوک c2 ورودی هشت طبقه 10", area: "شهرک اکباتان", driverName: "غلامرضa مرادی" },
    { id: 27, firstName: "روژان", lastName: "کیانی راد", fatherName: "مهرداد", phone1: "9191645484", phone2: "9191645484", grade: "نهم", address: "کوی بیمه پنجم نبش کوچه ششم ساختمان ساحل پلاک 12 واحد24", area: "کوی بیمه", driverName: "سارا مرادعلی" },
    { id: 28, firstName: "عسل", lastName: "اصغر زاده", fatherName: "بهنام", phone1: "9127764960", phone2: "9191302067", grade: "نهم", address: "کوی بیمه خیابان ریاحی نبش چهارم مجتمع آرمان", area: "کوی بیمه", driverName: "سارا مرادعلی" },
    { id: 29, firstName: "ویانا", lastName: "میرزایی", fatherName: "علیرضا", phone1: "9127257708", phone2: "9396117099", grade: "هفتم", address: "کوی بیمه ، آزمون نیا نرسیده به میدان سالاری مجتمع آفتاب واحد 22", area: "کوی بیمه", driverName: "سارا مرادعلی" },
    { id: 30, firstName: "باران", lastName: "امیری پناه", fatherName: "فرهاد", phone1: "9123448915", phone2: "9363448915", grade: "نهم", address: "بلوار فردوس شرق خیابان ابراهیمی جنوبی مجتمع افق اکباتان بلوک B واحد 4", area: "فردوس شرق", driverName: "اسماعیلی" },
    { id: 31, firstName: "دریا", lastName: "هاشمی", fatherName: "", phone1: "9126446972", phone2: "9126446972", grade: "نهم", address: "ستاری ، باغ فیض خیابان پیامبر شرقی خیابان", area: "فردوس شرق", driverName: "اسماعیلی" },
    { id: 32, firstName: "هانا", lastName: "قراخانلو", fatherName: "علی", phone1: "9125022570", phone2: "9125801550", grade: "هفتم", address: "بلوار فردوس شرق خیابان طاهریان خیابان صفویان کوچه احسانگر پلاک 15 واحد 4", area: "فردوس شرق", driverName: "اسماعیلی" },
].map((s, i) => ({ ...s, id: i + 1 })));

const contracts: Omit<Contract, 'paidAmount' | 'remainingAmount' | 'status'>[] = [
    { id: 201, studentName: "آوا خسروان", totalAmount: 23800000 },
    { id: 202, studentName: "نیکا گلاوی", totalAmount: 23600000 },
    { id: 203, studentName: "حلما اسماعیل آبادی", totalAmount: 22400000 },
    { id: 204, studentName: "مارال رضایی", totalAmount: 23800000 },
    { id: 205, studentName: "روشا صدری کیا", totalAmount: 23800000 },
    { id: 206, studentName: "ستاره آزاد", totalAmount: 23800000 },
    { id: 207, studentName: "آندیا دارابی", totalAmount: 23800000 },
    { id: 208, studentName: "صبا محمودی", totalAmount: 23800000 },
    { id: 209, studentName: "دنیا تویسرکانی", totalAmount: 22400000 },
    { id: 210, studentName: "آرنیکا عابدینی", totalAmount: 23800000 },
    { id: 211, studentName: "یلدا محمد صلاحی", totalAmount: 23800000 },
    { id: 212, studentName: "رونیکا خلجانی", totalAmount: 28000000 },
    { id: 213, studentName: "عسل اصغر زاده", totalAmount: 23800000 },
    { id: 214, studentName: "صهبا زارعی", totalAmount: 23800000 },
    { id: 215, studentName: "روژینا سلیمان حشمتی", totalAmount: 23800000 },
    { id: 216, studentName: "باران ابراهیمی", totalAmount: 28000000 },
    { id: 217, studentName: "ستایش یحیائی", totalAmount: 28000000 },
    { id: 218, studentName: "آسمان نعمتی", totalAmount: 28000000 },
    { id: 219, studentName: "سوریا عیدی زاده", totalAmount: 23800000 },
    { id: 220, studentName: "ترنم کوشکی", totalAmount: 22400000 },
    { id: 221, studentName: "سوگند کربلایی", totalAmount: 23800000 },
    { id: 222, studentName: "گیسو فیاض", totalAmount: 23800000 },
    { id: 223, studentName: "مهرسا افرایی", totalAmount: 22400000 },
    { id: 224, studentName: "رز خدیوی زند", totalAmount: 22400000 },
    { id: 225, studentName: "بهینا قپانوری", totalAmount: 23800000 },
    { id: 226, studentName: "تامای گنجی زاده", totalAmount: 23800000 },
    { id: 227, studentName: "روژان کیانی راد", totalAmount: 22400000 },
    { id: 228, studentName: "عسل عصارین", totalAmount: 22400000 },
    { id: 229, studentName: "ویانا میرزایی", totalAmount: 22400000 },
    { id: 230, studentName: "باران امیری پناه", totalAmount: 28000000 },
    { id: 231, studentName: "دریا هاشمی", totalAmount: 28000000 },
    { id: 232, studentName: "هانا قراخانلو", totalAmount: 23800000 },
].map((c, i) => ({ ...c, id: 201 + i }));

const drivers: Driver[] = [
    { id: 1001, name: "مریم توفیق پیروز", phone: "9197234940", vehicleType: "سواری ام وی ام 110", licensePlate: "49 ق294 ایران 77", route: "کوی بیمه", studentCount: 4, salary: 7000000 },
    { id: 1002, name: "غلامرضا مرادی", phone: "9172500095", vehicleType: "ون دلیکا - سبز", licensePlate: "83 ق 148 ایران 77", route: "شهرک اکباتان", studentCount: 10, salary: 17000000 },
    { id: 1003, name: "جهانگیر قاسمی", phone: "9123006658", vehicleType: "سواری ال 90 - مشگی", licensePlate: "61 ن 252 ایران 40", route: "بلوار فردوس شرق", studentCount: 4, salary: 7000000 },
    { id: 1004, name: "آذر قاسمی", phone: "9194488003", vehicleType: "سواری تیبا - سفید", licensePlate: "18 ب 296 ایران 66", route: "بلوار فردوس شرق", studentCount: 4, salary: 7000000 },
    { id: 1005, name: "حاجی باقری", phone: "9103307765", vehicleType: "سواری پراید - مشگی", licensePlate: "83 ق 148 ایران 77", route: "بلوار فردوس غرب", studentCount: 4, salary: 9000000 },
    { id: 1006, name: "اسماعیلی", phone: "9331034047", vehicleType: "سواری سمند ـ تاکسی زرد", licensePlate: "53 ت 471 ایران 33", route: "بلوار فردوس شرق", studentCount: 3, salary: 6000000 },
    { id: 1007, name: "سارا مرادعلی", phone: "9125098056", vehicleType: "سواری کوئیک - سفید", licensePlate: "92 س 535 ایران 60", route: "کوی بیمه", studentCount: 3, salary: 5200000 },
];

const payments: Payment[] = [
    { date: "1404/04/10", contractId: 201, studentName: "آوا خسروان", amount: 4000000, trackingNumber: "12345", type: "کارت به کارت" },
    { date: "1404/03/15", contractId: 202, studentName: "نیکا گلاوی", amount: 5000000, trackingNumber: "54321", type: "کارت به کارت" },
    { date: "1404/04/20", contractId: 202, studentName: "نیکا گلاوی", amount: 4600000, trackingNumber: "98765", type: "پرداخت آنلاین" },
    { date: "1404/02/01", contractId: 203, studentName: "حلما اسماعیل آبادی", amount: 8800000, trackingNumber: "11223", type: "کارت به کارت" },
    { date: "1404/03/05", contractId: 204, studentName: "مارال رضایی", amount: 7200000, trackingNumber: "44556", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 205, studentName: "روشا صدری کیا", amount: 7200000, trackingNumber: "60101", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 206, studentName: "ستاره آزاد", amount: 7800000, trackingNumber: "77889", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 207, studentName: "آندیا دارابی", amount: 7000000, trackingNumber: "60102", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 208, studentName: "صبا محمودی", amount: 9800000, trackingNumber: "60103", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 209, studentName: "دنیا تویسرکانی", amount: 6700000, trackingNumber: "60104", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 210, studentName: "آرنیکا عابدینی", amount: 9500000, trackingNumber: "60105", type: "کارت به کارت" },
    { date: "1404/04/18", contractId: 211, studentName: "یلدا محمد صلاحی", amount: 5000000, trackingNumber: "33221", type: "پرداخت آنلاین" },
    { date: "1404/05/01", contractId: 211, studentName: "یلدا محمد صلاحی", amount: 5000000, trackingNumber: "66554", type: "کارت به کارت" },
    { date: "1404/05/03", contractId: 212, studentName: "رونیکا خلجانی", amount: 10000000, trackingNumber: "99887", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 214, studentName: "صهبا زارعی", amount: 9500000, trackingNumber: "60106", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 215, studentName: "روژینا سلیمان حشمتی", amount: 9800000, trackingNumber: "60107", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 216, studentName: "باران ابراهیمی", amount: 10000000, trackingNumber: "60108", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 219, studentName: "سوریا عیدی زاده", amount: 9500000, trackingNumber: "60109", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 220, studentName: "ترنم کوشکی", amount: 8960000, trackingNumber: "60110", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 221, studentName: "سوگند کربلایی", amount: 8000000, trackingNumber: "60111", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 222, studentName: "گیسو فیاض", amount: 9500000, trackingNumber: "60112", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 223, studentName: "مهرسا افرایی", amount: 8800000, trackingNumber: "60113", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 224, studentName: "رز خدیوی زند", amount: 9500000, trackingNumber: "60114", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 225, studentName: "بهینا قپانوری", amount: 9500000, trackingNumber: "60115", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 226, studentName: "تامای گنجی زاده", amount: 9500000, trackingNumber: "60116", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 227, studentName: "روژان کیانی راد", amount: 8400000, trackingNumber: "60117", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 229, studentName: "ویانا میرزایی", amount: 8800000, trackingNumber: "60118", type: "کارت به کارت" },
    { date: "1404/05/09", contractId: 230, studentName: "باران امیری پناه", amount: 11200000, trackingNumber: "77788", type: "کارت به کارت" },
    { date: "1404/05/10", contractId: 231, studentName: "دریا هاشمی", amount: 14000000, trackingNumber: "12312", type: "کارت به کارت" },
    { date: "1404/04/01", contractId: 232, studentName: "هانا قراخانلو", amount: 9500000, trackingNumber: "60119", type: "کارت به کارت" },
    { date: "1404/07/30", contractId: 225, studentName: "بهینا قپانوری", amount: 3575000, trackingNumber: "532516", type: "کارت به کارت" },
    { date: "1404/07/30", contractId: 228, studentName: "عسل عصارین", amount: 5000000, trackingNumber: "367759", type: "کارت به کارت" },
    { date: "1404/07/30", contractId: 212, studentName: "رونیکا خلجانی", amount: 4500000, trackingNumber: "352462", type: "کارت به کارت" },
    { date: "1404/07/30", contractId: 208, studentName: "صبا محمودی", amount: 5000000, trackingNumber: "14043459230174", type: "کارت به کارت" },
    { date: "1404/07/30", contractId: 209, studentName: "دنیا تویسرکانی", amount: 3925000, trackingNumber: "610826", type: "کارت به کارت" },
    { date: "1404/08/01", contractId: 217, studentName: "ستایش یحیائی", amount: 4000000, trackingNumber: "124568", type: "کارت به کارت" },
    { date: "1404/08/01", contractId: 218, studentName: "آسمان نعمتی", amount: 5000000, trackingNumber: "106072", type: "کارت به کارت" },
    { date: "1404/08/01", contractId: 205, studentName: "روشا صدری کیا", amount: 4150000, trackingNumber: "106073", type: "کارت به کارت" },
    { date: "1404/08/02", contractId: 224, studentName: "رز خدیوی زند", amount: 3575000, trackingNumber: "USER_ADD_1", type: "کارت به کارت" },
];


// --- API CLIENT ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- UTILITY FUNCTIONS ---
const formatCurrency = (amount: number) => new Intl.NumberFormat('fa-IR').format(amount);

const getCurrentJalaliDate = () => {
    // Get the current date and format it to Persian calendar, using latin numbers for easy parsing.
    const today = new Date();
    const persianDate = today.toLocaleDateString('fa-IR-u-nu-latn').split('/');
    return {
        year: parseInt(persianDate[0]),
        month: parseInt(persianDate[1]),
        day: parseInt(persianDate[2]),
    };
};


// --- UI COMPONENTS ---

const Dashboard = ({ onShowChat, onCardClick, contractsData }) => {
    const totalTuition = contractsData.reduce((sum, c) => sum + c.totalAmount, 0);
    const totalPaid = contractsData.reduce((sum, c) => sum + c.paidAmount, 0);
    const totalDebt = contractsData.reduce((sum, c) => sum + c.remainingAmount, 0);
    const totalSalaries = drivers.reduce((sum, d) => sum + d.salary, 0);

    return (
        <div className="app-container dashboard-view">
            <header className="dashboard-header">
                <h1>داشبورد مدیریت سرویس</h1>
                <p>دبیرستان دخترانه عدالت - پیمانکار: رضا باقری</p>
            </header>
            <main className="dashboard">
                <div className="card financial-overview-card">
                    <div className="metric-item">
                        <span className="metric-value">{formatCurrency(totalTuition)} <small>تومان</small></span>
                        <span className="metric-label">کل شهریه‌ها</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-value">{formatCurrency(totalPaid)} <small>تومان</small></span>
                        <span className="metric-label">کل پرداختی‌ها</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-value">{formatCurrency(totalDebt)} <small>تومان</small></span>
                        <span className="metric-label">کل بدهی‌ها</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-value">{formatCurrency(totalSalaries)} <small>تومان</small></span>
                        <span className="metric-label">کل حقوق</span>
                    </div>
                </div>

                <div className="card clickable-card card-students" onClick={() => onCardClick('students')}>
                    <div className="card-content">
                        <div className="card-icon">👥</div>
                        <p className="card-main-stat">{students.length}</p>
                        <h3>دانش‌آموزان</h3>
                        <span className="card-subtitle">تعداد کل دانش‌آموزان</span>
                    </div>
                </div>
                <div className="card clickable-card card-drivers" onClick={() => onCardClick('drivers')}>
                    <div className="card-content">
                        <div className="card-icon">🚗</div>
                        <p className="card-main-stat">{drivers.length}</p>
                        <h3>رانندگان</h3>
                        <span className="card-subtitle">تعداد کل رانندگان</span>
                    </div>
                </div>
                <div className="card clickable-card card-contracts" onClick={() => onCardClick('contracts')}>
                    <div className="card-content">
                        <div className="card-icon">💰</div>
                        <p className="card-main-stat">{contractsData.length}</p>
                        <h3>قراردادها</h3>
                        <span className="card-subtitle">تعداد کل قراردادها</span>
                    </div>
                </div>
                <div className="card card-ai">
                     <div className="card-content">
                        <div className="card-icon">🤖</div>
                        <h3>دستیار هوشمند</h3>
                        <span className="card-subtitle">تحلیل داده، گزارش‌گیری و پرسش و پاسخ</span>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-light" onClick={onShowChat}>شروع چت</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatAssistant = ({ onBack, onPrint, messages, setMessages, contractsData }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent | string) => {
        if (typeof e !== 'string') {
            e.preventDefault();
        }

        const prompt = (typeof e === 'string') ? e : input;
        if (!prompt.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: prompt };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `${messages.map(m => `${m.sender}: ${m.text}`).join('\n')}\nuser: ${prompt}`,
                config: {
                    systemInstruction: `شما دستیار هوشمند و تحلیلگر مالی برای یک شرکت حمل و نقل دانش آموزی هستید. شما به تمام داده های شرکت دسترسی دارید و باید طبق قوانین دائمی زیر عمل کنید:
1.  **قوانین ظرفیت خودرو:** خودروهای سواری حداکثر 4 دانش آموز و خودروهای ون حداکثر 10 دانش آموز میتوانند داشته باشند.
2.  **قوانین پرداخت شهریه:** اولیا موظف هستند 37% از کل شهریه سالانه را هنگام ثبت نام پرداخت کنند. 63% باقی مانده باید در چهار قسط مساوی در تاریخ های اول آبان (ماه 8)، اول آذر (ماه 9)، اول دی (ماه 10) و اول بهمن (ماه 11) پرداخت شود.
3.  **قوانین حقوق راننده:** حقوق ماهانه ثبت شده برای هر راننده است. سال تحصیلی 8.5 ماه است. حقوق راننده معمولا حدود 60% از کل شهریه دریافتی از دانش آموزان تخصیص یافته به او است.
4.  **وظایف شما:**
    *   پاسخ به سوالات با استفاده از ابزارهای (functions) ارائه شده. هرگز داده ها را از تاریخچه گفتگو استخراج نکنید.
    *   تحلیل داده ها، شناسایی مشکلات (مانند بدهی ها یا ظرفیت بیش از حد خودروها) و ارائه گزارش.
    *   ارائه گزارش سود و زیان بر اساس درآمد کل (شهریه ها) و هزینه کل (حقوق رانندگان برای 8.5 ماه).
    *   هنگام ارائه اعلان یا گزارش در مورد مشکلات، بسیار واضح و دقیق باشید. گزارش های لیستی را در قالب جدول HTML ارائه دهید.`,
                    tools: tools,
                },
            });

            if (response.functionCalls && response.functionCalls.length > 0) {
                 for (const functionCall of response.functionCalls) {
                    let functionResponseText = '';
    
                    switch (functionCall.name) {
                        case 'generateDriverReport':
                            const driverNameToPrint = functionCall.args.driverName;
                            const driverToPrint = drivers.find(d => d.name.includes(driverNameToPrint) || driverNameToPrint.includes(d.name));
                            if (driverToPrint) {
                                onPrint(driverToPrint);
                            } else {
                                setMessages(prev => [...prev, { sender: 'ai', text: `متاسفانه راننده‌ای با نام "${driverNameToPrint}" پیدا نشد.` }]);
                            }
                            break;
                        
                        case 'getAllStudents': {
                             const studentRows = students.map((s, index) => `<tr><td>${index + 1}</td><td>${s.firstName} ${s.lastName}</td></tr>`).join('');
                            functionResponseText = `لیست کامل دانش آموزان:
                                <table>
                                    <thead><tr><th>ردیف</th><th>نام و نام خانوادگی</th></tr></thead>
                                    <tbody>${studentRows}</tbody>
                                </table>`;
                            setMessages(prev => [...prev, { sender: 'ai', text: functionResponseText }]);
                            break;
                        }

                        case 'getFinancialSummary':
                            const totalTuition = contractsData.reduce((sum, c) => sum + c.totalAmount, 0);
                            const totalPaid = contractsData.reduce((sum, c) => sum + c.paidAmount, 0);
                            const totalDebt = contractsData.reduce((sum, c) => sum + c.remainingAmount, 0);
                            const totalSalaries = drivers.reduce((sum, d) => sum + d.salary, 0);
                            functionResponseText = `خلاصه وضعیت مالی کل سیستم به شرح زیر است:\n\n- **مجموع کل شهریه‌ها:** ${formatCurrency(totalTuition)} تومان\n- **مجموع مبالغ پرداختی:** ${formatCurrency(totalPaid)} تومان\n- **مجموع بدهی‌های باقی‌مانده:** ${formatCurrency(totalDebt)} تومان\n- **مجموع حقوق ماهانه رانندگان:** ${formatCurrency(totalSalaries)} تومان`;
                            setMessages(prev => [...prev, { sender: 'ai', text: functionResponseText }]);
                            break;
                        
                        case 'getStudentDetails': {
                             const studentName = functionCall.args.studentName;
                             const student = students.find(s => `${s.firstName} ${s.lastName}`.includes(studentName) || studentName.includes(`${s.firstName} ${s.lastName}`));
                             if (student) {
                                 const contract = contractsData.find(c => c.studentName === `${student.firstName} ${student.lastName}`);
                                 const driver = drivers.find(d => d.name === student.driverName);
                                 functionResponseText = `اطلاعات کامل دانش‌آموز **${student.firstName} ${student.lastName}**:\n\n**مشخصات فردی:**\n- پایه: ${student.grade}\n- نام پدر: ${student.fatherName}\n- تلفن: ${student.phone1}\n- آدرس: ${student.address}\n\n**اطلاعات سرویس:**\n- راننده: ${driver?.name || 'تعیین نشده'}\n- تلفن راننده: ${driver?.phone || 'N/A'}\n\n**وضعیت مالی:**\n- کل شهریه: ${formatCurrency(contract?.totalAmount || 0)} تومان\n- پرداختی: ${formatCurrency(contract?.paidAmount || 0)} تومان\n- بدهی: ${formatCurrency(contract?.remainingAmount || 0)} تومان`;
                             } else {
                                 functionResponseText = `دانش‌آموزی با نام "${studentName}" یافت نشد. لطفاً نام را دقیق‌تر وارد کنید.`;
                             }
                             setMessages(prev => [...prev, { sender: 'ai', text: functionResponseText }]);
                             break;
                        }
                        case 'getDebtorsReport': {
                            const { debtorType } = functionCall.args;
                            const currentDate = getCurrentJalaliDate();
                            const dueDates = [
                                { month: 8, day: 1 }, // Aban
                                { month: 9, day: 1 }, // Azar
                                { month: 10, day: 1 }, // Dey
                                { month: 11, day: 1 }, // Bahman
                            ];

                            const debtors = contractsData.filter(c => {
                                if (c.remainingAmount <= 0) return false;
                                if (debtorType === 'all') return true;

                                // Overdue logic
                                const initialPaymentDue = c.totalAmount * 0.37;
                                const installmentAmount = (c.totalAmount * 0.63) / 4;
                                let totalAmountDueToday = initialPaymentDue;

                                for (const dueDate of dueDates) {
                                    if (currentDate.year > 1404 || (currentDate.year === 1404 && (currentDate.month > dueDate.month || (currentDate.month === dueDate.month && currentDate.day >= dueDate.day)))) {
                                        totalAmountDueToday += installmentAmount;
                                    }
                                }
                                return c.paidAmount < totalAmountDueToday;
                            });

                            if (debtors.length > 0) {
                                const tableRows = debtors.map(d => `<tr>
                                    <td>${d.studentName}</td>
                                    <td>${formatCurrency(d.remainingAmount)}</td>
                                    <td class="warning-cell">${formatCurrency(d.totalAmount)}</td>
                                </tr>`).join('');
                                functionResponseText = `گزارش دانش آموزان بدهکار (${debtorType === 'all' ? 'همه' : 'قسط معوق'}):
                                <table>
                                    <thead><tr><th>نام دانش آموز</th><th>مبلغ بدهی</th><th>کل شهریه</th></tr></thead>
                                    <tbody>${tableRows}</tbody>
                                </table>`;
                            } else {
                                functionResponseText = "در حال حاضر هیچ دانش آموز بدهکاری با شرایط خواسته شده یافت نشد.";
                            }
                            setMessages(prev => [...prev, { sender: 'ai', text: functionResponseText }]);
                            break;
                        }
                        case 'getCapacityIssues': {
                            const issues = drivers.filter(d =>
                                (d.vehicleType.includes('سواری') && d.studentCount > 4) ||
                                (d.vehicleType.includes('ون') && d.studentCount > 10)
                            );
                             if (issues.length > 0) {
                                const tableRows = issues.map(d => {
                                    const capacity = d.vehicleType.includes('ون') ? 10 : 4;
                                    return `<tr>
                                        <td>${d.name}</td>
                                        <td>${d.vehicleType}</td>
                                        <td>${capacity}</td>
                                        <td class="warning-cell">${d.studentCount}</td>
                                    </tr>`
                                }).join('');
                                functionResponseText = `<span class="warning-icon">⚠️</span> **هشدار ظرفیت غیرمجاز!**
                                <table>
                                    <thead><tr><th>نام راننده</th><th>نوع خودرو</th><th>ظرفیت مجاز</th><th>ظرفیت فعلی</th></tr></thead>
                                    <tbody>${tableRows}</tbody>
                                </table>`;
                            } else {
                                functionResponseText = "ظرفیت تمامی خودروها در محدوده مجاز قرار دارد.";
                            }
                            setMessages(prev => [...prev, { sender: 'ai', text: functionResponseText }]);
                            break;
                        }
                        case 'getProfitLossStatement': {
                             const totalRevenue = contractsData.reduce((sum, c) => sum + c.totalAmount, 0);
                             const totalExpenses = drivers.reduce((sum, d) => sum + (d.salary * 8.5), 0);
                             const profit = totalRevenue - totalExpenses;
                             functionResponseText = `گزارش سود و زیان سال تحصیلی (8.5 ماه):
                                <table>
                                    <tbody>
                                        <tr><td>درآمد کل (شهریه ها)</td><td>${formatCurrency(totalRevenue)} تومان</td></tr>
                                        <tr><td>هزینه کل (حقوق رانندگان)</td><td>-${formatCurrency(totalExpenses)} تومان</td></tr>
                                        <tr><th>سود نهایی</th><th>${formatCurrency(profit)} تومان</th></tr>
                                    </tbody>
                                </table>`;
                             setMessages(prev => [...prev, { sender: 'ai', text: functionResponseText }]);
                             break;
                        }
                    }
                 }
            } else {
                const aiMessage: Message = { sender: 'ai', text: response.text };
                setMessages(prev => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage: Message = { sender: 'ai', text: "متاسفانه مشکلی در ارتباط با دستیار هوشمند پیش آمده است." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="chat-container">
                <header className="chat-header">
                    <button onClick={onBack}>&rarr;</button>
                    <h2>دستیار هوشمند</h2>
                </header>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></div>
                    ))}
                    {isLoading && (
                        <div className="loading-indicator">
                            <div className="dot-flashing"></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                 {messages.length <= 1 && (
                     <div className="suggested-prompts">
                         <button onClick={() => handleSendMessage("گزارش سود و زیان را نمایش بده")}>سود و زیان</button>
                         <button onClick={() => handleSendMessage("کیا قسط عقب افتاده دارن؟")}>بدهکاران</button>
                         <button onClick={() => handleSendMessage("آیا ماشینی با ظرفیت غیر مجاز داریم؟")}>ظرفیت غیرمجاز</button>
                     </div>
                 )}
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="پیام خود را بنویسید..."
                        aria-label="Message Input"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>ارسال</button>
                </form>
            </div>
        </div>
    );
};

const ListView = ({ type, onBack, onItemClick, contractsData }) => {
    const [searchTerm, setSearchTerm] = useState('');

    let data, title, placeholder, theme;
    switch(type) {
        case 'students':
            data = students;
            title = 'دانش‌آموزان';
            placeholder = 'جستجوی نام دانش‌آموز...';
            theme = 'theme-students';
            break;
        case 'drivers':
            data = drivers;
            title = 'رانندگان';
            placeholder = 'جستجوی نام راننده...';
            theme = 'theme-drivers';
            break;
        case 'contracts':
            data = contractsData;
            title = 'قراردادها';
            placeholder = 'جستجوی نام دانش‌آموز...';
            theme = 'theme-contracts';
            break;
        default:
            data = [];
            title = 'لیست';
            placeholder = 'جستجو...';
            theme = '';
    }

    const filteredData = data.filter(item => {
        if (type === 'contracts') {
            return item.studentName.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (type === 'students') {
             return `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const getItemDetails = (item) => {
        if (type === 'students') return `${item.grade} - راننده: ${item.driverName}`;
        if (type === 'drivers') return `مسیر: ${item.route} - ${item.studentCount} دانش‌آموز`;
        if (type === 'contracts') return `مبلغ کل: ${formatCurrency(item.totalAmount)} - مانده: ${formatCurrency(item.remainingAmount)}`;
        return '';
    };

     const getItemTitle = (item) => {
        if (type === 'students') return `${item.firstName} ${item.lastName}`;
        if (type === 'contracts') return item.studentName;
        return item.name;
    };


    return (
        <div className={`list-view-app-container ${theme}`}>
            <div className="list-view-header">
                 <button className="back-btn" onClick={onBack}>&rarr;</button>
                 <h2>{title}</h2>
            </div>
            <div className="list-view-body">
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ul className="list-view-items">
                    {filteredData.map(item => (
                        <li key={item.id} onClick={() => onItemClick(item.id)}>
                            <div className="list-item-content">
                                <span>{getItemTitle(item)}</span>
                                <span className="list-item-detail">{getItemDetails(item)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const StudentDetail = ({ studentId, onBack, onDriverClick, contractsData }) => {
    const student = students.find(s => s.id === studentId);
    const contract = contractsData.find(c => c.studentName === `${student?.firstName} ${student?.lastName}`);
    const driver = drivers.find(d => d.name === student?.driverName);

    if (!student) return <div>دانش آموز یافت نشد.</div>;

    return (
        <div className="detail-view-container theme-students">
            <div className="detail-hero-card">
                 <div className="detail-view-top-bar">
                    <button className="back-btn" onClick={onBack}>&rarr;</button>
                </div>
                 <div className="detail-hero-icon">👤</div>
                <h2>{student.firstName} {student.lastName}</h2>
            </div>
            <div className="detail-content-wrapper">
                <div className="detail-card">
                    <h3>مشخصات فردی</h3>
                    <div className="info-grid">
                        <p><strong>نام پدر:</strong> {student.fatherName}</p>
                        <p><strong>پایه:</strong> {student.grade}</p>
                        <p><strong>تلفن ۱:</strong> <a href={`tel:${student.phone1}`}>{student.phone1}</a></p>
                        <p><strong>تلفن ۲:</strong> <a href={`tel:${student.phone2}`}>{student.phone2}</a></p>
                        <p><strong>آدرس:</strong> {student.address}</p>
                        <p><strong>محدوده:</strong> {student.area}</p>
                    </div>
                </div>
                 <div className="detail-card">
                    <h3>اطلاعات سرویس</h3>
                    <div className="info-grid">
                        <p><strong>راننده:</strong> <span className="clickable-row" onClick={() => onDriverClick(driver?.id)}>{driver?.name || 'N/A'}</span></p>
                        <p><strong>تلفن راننده:</strong> <a href={`tel:${driver?.phone}`}>{driver?.phone || 'N/A'}</a></p>
                    </div>
                </div>
                 {contract && (
                     <div className="detail-card">
                         <h3>وضعیت مالی</h3>
                         <div className="financial-summary-grid">
                             <div className="summary-item total"><span className="label">کل شهریه</span><span className="value">{formatCurrency(contract.totalAmount)}</span></div>
                             <div className="summary-item paid"><span className="label">پرداختی</span><span className="value">{formatCurrency(contract.paidAmount)}</span></div>
                             <div className="summary-item remaining"><span className="label">بدهی</span><span className="value">{formatCurrency(contract.remainingAmount)}</span></div>
                         </div>
                         <div className="progress-bar-component">
                             <div className="progress-track">
                                 <div className="progress-fill" style={{ width: `${(contract.paidAmount / contract.totalAmount) * 100}%` }}>
                                     {Math.round((contract.paidAmount / contract.totalAmount) * 100)}%
                                 </div>
                             </div>
                         </div>
                     </div>
                 )}
            </div>
        </div>
    );
};

const DriverDetail = ({ driverId, onBack, onStudentClick }) => {
    const driver = drivers.find(d => d.id === driverId);
    const assignedStudents = students.filter(s => s.driverName === driver?.name);

    if (!driver) return <div>راننده یافت نشد.</div>;

    const [iran, num] = driver.licensePlate.split(" ایران ");

    return (
        <div className="detail-view-container theme-drivers">
            <div className="detail-hero-card">
                <div className="detail-view-top-bar">
                    <button className="back-btn" onClick={onBack}>&rarr;</button>
                </div>
                <div className="detail-hero-icon">🚗</div>
                <h2>{driver.name}</h2>
            </div>
            <div className="detail-content-wrapper">
                <div className="detail-card">
                    <h3>مشخصات راننده</h3>
                     <div className="info-grid">
                        <p><strong>تلفن:</strong> <a href={`tel:${driver.phone}`}>{driver.phone}</a></p>
                        <p><strong>نوع خودرو:</strong> {driver.vehicleType}</p>
                        <p><strong>مسیر:</strong> {driver.route}</p>
                         <p><strong>حقوق ماهانه:</strong> {formatCurrency(driver.salary)} تومان</p>
                         <div className="info-grid-item-plate">
                             <strong>پلاک:</strong>
                             <div className="license-plate">
                                 <div className="plate-band">
                                     <div className="plate-flag">IR</div>
                                     <div className="plate-country">IRAN</div>
                                 </div>
                                 <div className="plate-main">
                                     <span className="plate-part">{iran.substring(0, 2)}</span>
                                     <span className="plate-part">{iran.substring(3, 6)}</span>
                                     <span className="plate-part">{iran.substring(2, 3)}</span>
                                     <div className="plate-separator"></div>
                                     <span className="plate-part">{num}</span>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
                <div className="detail-card">
                    <h3>دانش آموزان ({assignedStudents.length} نفر)</h3>
                    <table className="detail-table">
                        <thead><tr><th>نام</th><th>پایه</th><th>تلفن</th></tr></thead>
                        <tbody>
                            {assignedStudents.map(s => (
                                <tr key={s.id} className="clickable-row" onClick={() => onStudentClick(s.id)}>
                                    <td>{s.firstName} {s.lastName}</td>
                                    <td>{s.grade}</td>
                                    <td>{s.phone1}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ContractDetail = ({ contractId, onBack, onStudentClick, contractsData }) => {
     const contract = contractsData.find(c => c.id === contractId);
     const student = students.find(s => contract?.studentName === `${s.firstName} ${s.lastName}`);
     const contractPayments = payments.filter(p => p.contractId === contractId).sort((a, b) => b.date.localeCompare(a.date));

     if (!contract || !student) return <div>قرارداد یافت نشد.</div>;

     return (
        <div className="detail-view-container theme-contracts">
            <div className="detail-hero-card">
                <div className="detail-view-top-bar">
                    <button className="back-btn" onClick={onBack}>&rarr;</button>
                </div>
                <div className="detail-hero-icon">💰</div>
                <h2 className="clickable-row" onClick={() => onStudentClick(student.id)}>{contract.studentName}</h2>
            </div>
            <div className="detail-content-wrapper">
                 <div className="detail-card">
                     <h3>وضعیت مالی</h3>
                      <div className="financial-summary-grid">
                         <div className="summary-item total"><span className="label">کل شهریه</span><span className="value">{formatCurrency(contract.totalAmount)}</span></div>
                         <div className="summary-item paid"><span className="label">پرداختی</span><span className="value">{formatCurrency(contract.paidAmount)}</span></div>
                         <div className="summary-item remaining"><span className="label">بدهی</span><span className="value">{formatCurrency(contract.remainingAmount)}</span></div>
                     </div>
                     <div className="progress-bar-component">
                         <div className="progress-track">
                             <div className="progress-fill" style={{ width: `${(contract.paidAmount / contract.totalAmount) * 100}%` }}>
                                 {Math.round((contract.paidAmount / contract.totalAmount) * 100)}% پرداخت شده
                             </div>
                         </div>
                     </div>
                 </div>

                <div className="detail-card">
                     <h3>تاریخچه پرداخت‌ها</h3>
                     <table className="detail-table">
                         <thead><tr><th>تاریخ</th><th>مبلغ</th><th>نوع</th><th>کد رهگیری</th></tr></thead>
                         <tbody>
                            {contractPayments.map((p, i) => (
                                <tr key={i}>
                                    <td>{p.date}</td>
                                    <td>{formatCurrency(p.amount)}</td>
                                    <td>{p.type}</td>
                                    <td>{p.trackingNumber}</td>
                                </tr>
                            ))}
                         </tbody>
                     </table>
                 </div>
            </div>
        </div>
    );
}

// --- MAIN APP COMPONENT ---
const App = () => {
    const [view, setView] = useState({ type: 'dashboard', id: null });
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'سلام! من دستیار هوشمند شما هستم. چطور می‌توانم در مدیریت سرویس مدرسه به شما کمک کنم؟' }
    ]);
    const [printData, setPrintData] = useState(null);

    // Recalculate financial data from the source of truth (payments) to ensure consistency.
    const processedContracts: Contract[] = contracts.map(contract => {
        const studentPayments = payments.filter(p => p.contractId === contract.id);
        const calculatedPaidAmount = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const calculatedRemainingAmount = contract.totalAmount - calculatedPaidAmount;
        const newStatus = calculatedRemainingAmount > 0 ? "بدهکار" : "تسویه";
        return {
            ...contract,
            paidAmount: calculatedPaidAmount,
            remainingAmount: calculatedRemainingAmount,
            status: newStatus,
        };
    });


    const handleCardClick = (type) => setView({ type: 'list', id: type });
    const handleItemClick = (type, id) => setView({ type: `detail-${type}s`, id: id });
    const handleBack = () => {
        if (view.type.startsWith('detail-')) {
            const listType = view.type.split('-')[1];
             setView({ type: 'list', id: listType });
        } else {
             setView({ type: 'dashboard', id: null });
        }
    }
    const handlePrint = (driver) => setPrintData(driver);

    const renderView = () => {
        if (printData) {
            // This view is meant for printing and won't be visible on screen
            return null;
        }

        switch (view.type) {
            case 'dashboard':
                return <Dashboard onShowChat={() => setView({ type: 'chat', id: null })} onCardClick={handleCardClick} contractsData={processedContracts} />;
            case 'chat':
                return <ChatAssistant onBack={() => setView({ type: 'dashboard', id: null })} onPrint={handlePrint} messages={messages} setMessages={setMessages} contractsData={processedContracts} />;
            case 'list':
                return <ListView type={view.id} onBack={handleBack} onItemClick={(itemId) => handleItemClick(view.id.slice(0, -1), itemId)} contractsData={processedContracts} />;
            case 'detail-students':
                return <StudentDetail studentId={view.id} onBack={handleBack} onDriverClick={(driverId) => setView({type: 'detail-drivers', id: driverId})} contractsData={processedContracts} />;
            case 'detail-drivers':
                return <DriverDetail driverId={view.id} onBack={handleBack} onStudentClick={(studentId) => setView({type: 'detail-students', id: studentId})} />;
            case 'detail-contracts':
                 return <ContractDetail contractId={view.id} onBack={handleBack} onStudentClick={(studentId) => setView({type: 'detail-students', id: studentId})} contractsData={processedContracts} />;
            default:
                return <div>View not found</div>;
        }
    };
    
    // This is a simplified print trigger for the demo
    useEffect(() => {
        if (printData) {
            // In a real app, you might render the print layout to a hidden iframe and print that
            // For this environment, we'll just log it and reset.
            console.log("Printing data for:", printData.name);
            alert(`گزارش برای ${printData.name} آماده چاپ است.`);
            setPrintData(null); // Reset after "printing"
        }
    }, [printData]);

    return renderView();
};


const tools: FunctionDeclaration[] = [
    {
        name: 'getAllStudents',
        description: 'دریافت لیست کامل تمامی دانش آموزان ثبت نام شده در سرویس.',
        parameters: { type: Type.OBJECT, properties: {} },
    },
    {
        name: 'getStudentDetails',
        description: 'دریافت اطلاعات کامل یک دانش آموز خاص شامل اطلاعات فردی، راننده و وضعیت مالی.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                studentName: {
                    type: Type.STRING,
                    description: 'نام و نام خانوادگی دانش آموز. مثال: "آوا خسروان"',
                },
            },
            required: ['studentName'],
        },
    },
    {
        name: 'getFinancialSummary',
        description: 'دریافت خلاصه وضعیت مالی کل سیستم شامل مجموع شهریه ها، پرداختی ها و بدهی ها.',
        parameters: { type: Type.OBJECT, properties: {} },
    },
    {
        name: 'getDebtorsReport',
        description: 'گزارشی از دانش آموزانی که بدهی دارند و موعد پرداخت قسط آنها گذشته است، تهیه میکند.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                debtorType: {
                    type: Type.STRING,
                    description: 'نوع بدهکاران برای گزارش گیری. میتواند "all" برای همه بدهکاران، یا "overdue" برای بدهکاران دارای قسط معوقه باشد.',
                },
            },
            required: ['debtorType'],
        },
    },
    {
        name: 'getCapacityIssues',
        description: 'بررسی میکند که آیا راننده ای بیش از ظرفیت مجاز خودروی خود دانش آموز حمل میکند یا خیر.',
        parameters: { type: Type.OBJECT, properties: {} },
    },
    {
        name: 'getProfitLossStatement',
        description: 'محاسبه و ارائه گزارش سود و زیان بر اساس درآمد کل (شهریه ها) و هزینه کل (حقوق رانندگان).',
        parameters: { type: Type.OBJECT, properties: {} },
    },
    {
        name: 'generateDriverReport',
        description: 'یک گزارش قابل چاپ از اطلاعات یک راننده و لیست دانش آموزان او تهیه میکند.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                driverName: {
                    type: Type.STRING,
                    description: 'نام راننده برای تهیه گزارش. مثال: "غلامرضا مرادی"',
                },
            },
            required: ['driverName'],
        },
    },
];

const root = createRoot(document.getElementById('root'));
root.render(<App />);