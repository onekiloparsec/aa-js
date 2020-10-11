'use strict'
import jd from './julianday'

function isDateAfterPapalReform (Year, Month, Day) {
  return ((Year > 1582) || ((Year === 1582) && (Month > 10)) || ((Year === 1582) && (Month === 10) && (Day >= 15)))
}

function isJulianDayAfterPapalReform (JD) {
  return (JD >= 2299160.5)
}

function makeDateToJD (Year, Month, Day, bGregorianCalendar = true) {
  let Y = Year
  let M = Month
  if (M < 3) {
    Y = Y - 1
    M = M + 12
  }

  let B = 0
  if (bGregorianCalendar) {
    const A = Math.floor(Y / 100.0)
    B = 2 - A + Math.floor(A / 4.0)
  }

  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + Day + B - 1524.5
}

function isLeapYear (Year, bGregorianCalendar = true) {
  if (bGregorianCalendar) {
    if ((Year % 100) === 0) {
      return ((Year % 400) === 0)
    } else {
      return ((Year % 4) === 0)
    }
  } else {
    return ((Year % 4) === 0)
  }
}

// void CAADate::Set(long Year, long Month, double Day, double Hour, double Minute, double Second, bool bGregorianCalendar)
// {
//   double dblDay = Day + (Hour/24) + (Minute/1440) + (Second / 86400);
//   Set(DateToJD(Year, Month, dblDay, bGregorianCalendar), bGregorianCalendar);
// }

// void CAADate::Get(long& Year, long& Month, long& Day, long& Hour, long& Minute, double& Second) const
//   {
//     double JD = m_dblJulian + 0.5;
// double tempZ = 0;
// double F = modf(JD, &tempZ);
// long Z = static_cast<long>(tempZ);
// long A;
//
// if (m_bGregorianCalendar) //There is a difference here between the Meeus implementation and this one
// //if (Z >= 2299161)       //The Meeus implementation automatically assumes the Gregorian Calendar
// //came into effect on 15 October 1582 (JD: 2299161), while the CAADate
// //implementation has a "m_bGregorianCalendar" value to decide if the date
// //was specified in the Gregorian or Julian Calendars. This difference
// //means in effect that CAADate fully supports a propalactive version of the
// //Julian calendar. This allows you to construct Julian dates after the Papal
// //reform in 1582. This is useful if you want to construct dates in countries
// //which did not immediately adapt the Gregorian calendar
// {
//   long alpha = INT((Z - 1867216.25) / 36524.25);
//   A = Z + 1 + alpha - INT(INT(alpha)/4.0);
// }
// else
//   A = Z;
//
// long B = A + 1524;
// long C = INT((B - 122.1) / 365.25);
// long D = INT(365.25 * C);
// long E = INT((B - D) / 30.6001);
//
// double dblDay = B - D - INT(30.6001 * E) + F;
// Day = static_cast<long>(dblDay);
//
// if (E < 14)
//   Month = E - 1;
// else
//   Month = E - 13;
//
// if (Month > 2)
//   Year = C - 4716;
// else
//   Year = C - 4715;
//
// F = modf(dblDay, &tempZ);
// Hour = INT(F*24);
// Minute = INT((F - (Hour)/24.0)*1440.0);
// Second = (F - (Hour / 24.0) - (Minute / 1440.0)) * 86400.0;
// }

// void CAADate::Set(double JD, bool bGregorianCalendar)
// {
//   m_dblJulian = JD;
//   SetInGregorianCalendar(bGregorianCalendar);
// }
//
// void CAADate::SetInGregorianCalendar(bool bGregorianCalendar)
// {
//   bool bAfterPapalReform = AfterPapalReform(m_dblJulian);
//
//   #ifdef _DEBUG
//   if (bGregorianCalendar) //We do not allow storage of proleptic Gregorian dates
//     assert(bAfterPapalReform);
//   #endif //#ifdef _DEBUG
//
//   m_bGregorianCalendar = bGregorianCalendar && bAfterPapalReform;
// }

// // long CAADate::Day() const
// //   {
// //     long Year = 0;
// // long Month = 0;
// // long Day = 0;
// // long Hour = 0;
// // long Minute = 0;
// // double Second = 0;
// // Get(Year, Month, Day, Hour, Minute, Second);
// // return Day;
// // }
// //
// // long CAADate::Month() const
// //   {
// //     long Year = 0;
// // long Month = 0;
// // long Day = 0;
// // long Hour = 0;
// // long Minute = 0;
// // double Second = 0;
// // Get(Year, Month, Day, Hour, Minute, Second);
// // return Month;
// // }
// //
// // long CAADate::Year() const
// //   {
// //     long Year = 0;
// // long Month = 0;
// // long Day = 0;
// // long Hour = 0;
// // long Minute = 0;
// // double Second = 0;
// // Get(Year, Month, Day, Hour, Minute, Second);
// // return Year;
// // }
// //
// // long CAADate::Hour() const
// //   {
// //     long Year = 0;
// // long Month = 0;
// // long Day = 0;
// // long Hour = 0;
// // long Minute = 0;
// // double Second = 0;
// // Get(Year, Month, Day, Hour, Minute, Second);
// // return Hour;
// // }
// //
// // long CAADate::Minute() const
// //   {
// //     long Year = 0;
// // long Month = 0;
// // long Day = 0;
// // long Hour = 0;
// // long Minute = 0;
// // double Second = 0;
// // Get(Year, Month, Day, Hour, Minute, Second);
// // return Minute;
// // }
// //
// // double CAADate::Second() const
// //   {
// //     long Year = 0;
// // long Month = 0;
// // long Day = 0;
// // long Hour = 0;
// // long Minute = 0;
// // double Second = 0;
// // Get(Year, Month, Day, Hour, Minute, Second);
// // return Second;
// // }
// //
// // CAADate::DAY_OF_WEEK CAADate::DayOfWeek() const
// //   {
// //     return static_cast<DAY_OF_WEEK>((static_cast<long>(m_dblJulian + 1.5) % 7));
// // }
// //
// // long CAADate::DaysInMonth(long Month, bool bLeap)
// // {
// //   //Validate our parameters
// //   assert(Month >= 1 && Month <= 12);
// //   #ifdef _MSC_VER
// //   __analysis_assume(Month >= 1 && Month <= 12);
// //   #endif //#ifdef _MSC_VER
// //
// //   int MonthLength[] =
// //   {
// //     31, 28, 31, 30, 31, 30,
// //     31, 31, 30, 31, 30, 31
// //   };
// //   if (bLeap)
// //     MonthLength[1]++;
// //
// //   return MonthLength[Month-1];
// // }
// //
// // long CAADate::DaysInMonth() const
// //   {
// //     long Year = 0;
// // long Month = 0;
// // long Day = 0;
// // long Hour = 0;
// // long Minute = 0;
// // double Second = 0;
// // Get(Year, Month, Day, Hour, Minute, Second);
// //
// // return DaysInMonth(Month, IsLeap(Year, m_bGregorianCalendar));
// // }
// //
// // long CAADate::DaysInYear() const
// //   {
// //     long Year = 0;
// // long Month = 0;
// // long Day = 0;
// // long Hour = 0;
// // long Minute = 0;
// // double Second = 0;
// // Get(Year, Month, Day, Hour, Minute, Second);
// //
// // if (IsLeap(Year, m_bGregorianCalendar))
// //   return 366;
// // else
// //   return 365;
// // }
// //
// // double CAADate::DayOfYear() const
// //   {
// //     long Year = 0;
// // long Month = 0;
// // long Day = 0;
// // long Hour = 0;
// // long Minute = 0;
// // double Second = 0;
// // Get(Year, Month, Day, Hour, Minute, Second);
// //
// // return DayOfYear(m_dblJulian, Year, AfterPapalReform(Year, 1, 1));
// // }
// //
// // double CAADate::DayOfYear(double JD, long Year, bool bGregorianCalendar)
// // {
// //   return JD - DateToJD(Year, 1, 1, bGregorianCalendar) + 1;
// // }

function fractionalYear (jdValue, bGregorianCalendar = true) {
  const JD = jd.JulianDay(jdValue)
  const Year = JD.toDate().fullYear()
  const DaysInYear = (isLeapYear(Year, bGregorianCalendar)) ? 366 : 365
  return Year + ((jdValue - makeDateToJD(Year, 1, 1)) / DaysInYear)
}

//
// bool CAADate::Leap() const
//   {
//     return IsLeap(Year(), m_bGregorianCalendar);
// }
//
// void CAADate::DayOfYearToDayAndMonth(long DayOfYear, bool bLeap, long& DayOfMonth, long& Month)
// {
//   long K = bLeap ? 1 : 2;
//
//   Month = INT(9*(K + DayOfYear)/275.0 + 0.98);
//   if (DayOfYear < 32)
//     Month = 1;
//
//   DayOfMonth = DayOfYear - INT((275*Month)/9.0) + (K*INT((Month + 9)/12.0)) + 30;
// }

// long CAADate::INT(double value)
// {
//   if (value >= 0)
//     return static_cast<long>(value);
//   else
//     return static_cast<long>(value - 1);
// }
//
// CAACalendarDate CAADate::JulianToGregorian(long Year, long Month, long Day)
// {
//   CAADate date(Year, Month, Day, false);
//   date.SetInGregorianCalendar(true);
//
//   CAACalendarDate GregorianDate;
//   long Hour = 0;
//   long Minute = 0;
//   double Second = 0;
//   date.Get(GregorianDate.Year, GregorianDate.Month, GregorianDate.Day, Hour, Minute, Second);
//
//   return GregorianDate;
// }
//
// CAACalendarDate CAADate::GregorianToJulian(long Year, long Month, long Day)
// {
//   CAADate date(Year, Month, Day, true);
//   date.SetInGregorianCalendar(false);
//
//   CAACalendarDate JulianDate;
//   long Hour = 0;
//   long Minute = 0;
//   double Second = 0;
//   date.Get(JulianDate.Year, JulianDate.Month, JulianDate.Day, Hour, Minute, Second);
//
//   return JulianDate;
// }

export default {
  isDateAfterPapalReform,
  isJulianDayAfterPapalReform,
  makeDateToJD,
  isLeapYear,
  fractionalYear
}
