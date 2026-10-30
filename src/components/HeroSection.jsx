import React from 'react';
import { 
  Sparkles, CheckCircle2, Award, BookOpen, ArrowLeft, Shield, 
  Target, Users, Zap, Layers, ChevronDown, Atom, Plus, Minus
} from 'lucide-react';
import InteractiveAtom from './InteractiveAtom';

export default function HeroSection({ onNavigate }) {
  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Header Section */}
      <section className="relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-moe-green/10 via-moe-teal/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Right Column: Hero Pitch & Core CTAs */}
            <div className="lg:col-span-7 space-y-6 text-right max-w-2xl">
              
              {/* Badge */}
              <div className="inline-flex flex-wrap items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-bold text-moe-navy">
                <span className="w-2 h-2 rounded-full bg-moe-green animate-pulse" />
                <span>مبادرة إثرائية مبنية على كتاب كيمياء 1 (مسارات)</span>
                <span className="text-slate-300">|</span>
                <span className="text-moe-teal">متوسطة وثانوية جميما</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[32px] sm:text-[44px] lg:text-[58px] font-extrabold text-moe-navy leading-[1.15] tracking-tight">
                أتقن مهارتي –
                <span className="block text-moe-gradient mt-1.5">
                  التوزيع الإلكتروني للذرات والأيونات
                </span>
              </h1>

              {/* Welcoming slogan */}
              <p className="text-base sm:text-lg font-bold text-slate-700 leading-relaxed">
                «تعلّمي، قارني بين الذرة والأيون، واكتشفي الخلل في «خطأ نودّعه» لتصلي إلى الإتقان الكامل»
              </p>

              {/* Mission & Target Audience */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
                منصة تفاعلية تخصصية صُممت لتمكين طالبات كيمياء 1 من إتقان التوزيع الإلكتروني للذرة المتعادلة والأيونات الموجبة والسالبة بدقة علمية (فقد الإلكترونات من أعلى مستوى رئيسي n أولاً، واكتساب الإلكترونات في المجالات الشاغرة)، عبر التفكير الناقد وتصحيح الأخطاء الشائعة.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                
                {/* 1. تدريب الأيونات (New Highlight) */}
                <button
                  onClick={() => onNavigate('ions')}
                  className="px-6 py-3.5 rounded-2xl bg-moe-green hover:bg-moe-green-dark text-white font-extrabold text-xs sm:text-sm shadow-md shadow-moe-green/25 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Zap className="w-4 h-4 text-emerald-200" />
                  <span>تدريب الأيونات (موجبة وسالبة)</span>
                  <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">جديد</span>
                </button>

                {/* 2. خطأ نودّعه (Core Highlight) */}
                <button
                  onClick={() => onNavigate('challenge')}
                  className="px-6 py-3.5 rounded-2xl bg-moe-navy hover:bg-moe-navy-light text-white font-extrabold text-xs sm:text-sm shadow-md shadow-moe-navy/25 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <CheckCircle2 className="w-4 h-4 text-moe-teal" />
                  <span>تحدي «خطأ نودّعه»</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {/* 3. ابدئي التعلم */}
                <button
                  onClick={() => onNavigate('learn')}
                  className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 shadow-xs flex items-center gap-2 transition-all"
                >
                  <BookOpen className="w-4 h-4 text-moe-teal" />
                  <span>دليل القواعد</span>
                </button>

                {/* 4. لوحة المعلمة المحمية */}
                <button
                  onClick={() => onNavigate('teacher')}
                  className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1.5 transition-all"
                  title="لوحة المعلمة والمشرفة"
                >
                  <Shield className="w-3.5 h-3.5 text-moe-purple" />
                  <span>بوابة المعلمة</span>
                </button>

              </div>

              {/* Attribution Line */}
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-moe-teal" />
                <span>إشراف وتنفيذ: المعلمة/ أ. ذكرى آل صديق — متوسطة وثانوية جميما</span>
              </div>

            </div>

            {/* Left Column: Visual Interactive Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <InteractiveAtom />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-moe-teal bg-moe-teal-tint px-3 py-1 rounded-full border border-moe-teal/20">
            ركائز المبادرة العلمية
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-moe-navy">
            مسار متكامل من التأسيس إلى الإتقان والتقييم
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: تدريب الأيونات */}
          <div 
            onClick={() => onNavigate('ions')}
            className="bg-white rounded-3xl p-6 border-2 border-emerald-200 hover:border-moe-green shadow-soft hover:shadow-elevated transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-moe-green flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-moe-navy group-hover:text-moe-green transition-colors">
                تدريب الأيونات الموجبة والسالبة
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                شرح الفروق الجوهرية بين الذرة المتعادلة (e = Z) والأيون الموجب (فقد من أعلى مستوى n أولاً) والأيون السالب (اكتساب إلكترونات في المجالات الشاغرة)، مع أمثلة دقيقة مثل Al³⁺, Na⁺, Mg²⁺, Cl⁻, O²⁻.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-moe-green">
              <span>استكشفي معمل الأيونات</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>

          {/* Card 2: تحدي خطأ نودّعه */}
          <div 
            onClick={() => onNavigate('challenge')}
            className="bg-white rounded-3xl p-6 border-2 border-moe-navy/20 hover:border-moe-navy shadow-soft hover:shadow-elevated transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-moe-navy flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-moe-navy" />
              </div>
              <h3 className="text-lg font-black text-moe-navy group-hover:text-moe-navy transition-colors">
                تحدي «خطأ نودّعه»
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                استراتيجية تشخيصية ناقدة: تعرض المنصة توزيعاً إلكترونياً خاطئاً، وتطلب من الطالبة اكتشاف نوع وموضع الخطأ، ثم تصحيحه مع التعليل العلمي الدقيق.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-moe-navy">
              <span>خوض التحدي الآن</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>

          {/* Card 3: قياس الأثر ولوحة المعلمة */}
          <div 
            onClick={() => onNavigate('teacher')}
            className="bg-white rounded-3xl p-6 border-2 border-purple-200 hover:border-moe-purple shadow-soft hover:shadow-elevated transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-moe-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-moe-navy group-hover:text-moe-purple transition-colors">
                لوحة المعلمة وقياس الأثر
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                بوابة محمية بكلمة مرور خاصة بالمعلمة لمتابعة درجات القبلي والبعدي، نسب الإتقان، إدارة الطالبات برموز مشفرة (S01, S02) لحماية الخصوصية، وتصدير تقرير الإدارة.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-moe-purple">
              <span>دخول بوابة المعلمة</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
