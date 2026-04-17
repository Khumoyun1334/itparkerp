import { CalendarDays, Clock } from "lucide-react";

export const COURSE_TYPES = {
  WEEKLY_3_DAYS: {
    id: "weekly_3",
    name: "Haftada 3 kun",
    daysPerWeek: 3,
    icon: "📅",
    description: "Du-Ch-Ju yoki Se-Pa-Sh"
  },
  WEEKLY_5_DAYS: {
    id: "weekly_5", 
    name: "Haftada 5 kun",
    daysPerWeek: 5,
    icon: "📆",
    description: "Du-Shanba (5 kun)"
  }
};

export const COURSE_DURATIONS = {
  MONTHS_6: {
    id: "6_months",
    name: "6 oylik",
    months: 6,
    icon: "🎓",
    totalWeeks: 24,
    totalDays: 72  // 6 oy × 4 hafta × 3 kun
  },
  MONTHS_10: {
    id: "10_months", 
    name: "10 oylik",
    months: 10,
    icon: "📚",
    totalWeeks: 40,
    totalDays: 120
  },
  MONTHS_12: {
    id: "12_months",
    name: "12 oylik", 
    months: 12,
    icon: "🏆",
    totalWeeks: 48,
    totalDays: 144
  }
};

// Default qiymatlar - 6 oy, haftada 3 kun
export const DEFAULT_COURSE_TYPE = COURSE_TYPES.WEEKLY_3_DAYS.id;
export const DEFAULT_COURSE_DURATION = COURSE_DURATIONS.MONTHS_6.id;

export const getMonthlyDays = (courseType, year, month) => {
  // Berilgan oyda necha kun dars borligini hisoblash
  const date = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let lessonDays = 0;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dayOfWeek = currentDate.getDay(); // 0=Yak, 1=Du, 2=Se, 3=Ch, 4=Pa, 5=Ju, 6=Sh
    
    if (courseType === COURSE_TYPES.WEEKLY_3_DAYS.id) {
      // Haftada 3 kun: Du(1), Ch(3), Ju(5)
      if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
        lessonDays++;
      }
    } else if (courseType === COURSE_TYPES.WEEKLY_5_DAYS.id) {
      // Haftada 5 kun: Du(1) - Ju(5)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        lessonDays++;
      }
    }
  }
  
  return lessonDays;
};

// Kurs boshlangan kundan boshlab necha oy o'tganini hisoblash
export const getMonthsPassed = (startDate) => {
  const start = new Date(startDate);
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12;
  const monthDiff = months + (now.getMonth() - start.getMonth());
  return Math.min(monthDiff, 6); // Maksimum 6 oy
};

// Qolgan oylar soni
export const getRemainingMonths = (startDate) => {
  const passed = getMonthsPassed(startDate);
  return Math.max(0, 6 - passed);
};