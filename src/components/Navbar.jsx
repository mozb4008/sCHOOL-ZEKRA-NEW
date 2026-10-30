import React, { useState } from 'react';
import { 
  Sparkles, Award, Shield, RotateCcw, Menu, X, BookOpen, 
  Compass, CheckCircle2, BarChart3, FileText, Zap, Atom 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, role, progressSummary }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Compass },
    { id: 'ions', label: 'تدريب الأيونات', icon: Zap, badge: 'جديد' },
    { id: 'challenge', label: 'خطأ نودّعه', icon: CheckCircle2, highlight: true },
    { id: 'learn', label: 'تعلّم التوزيع', icon: BookOpen },
    { id: 'lab', label: 'مختبر التدريب', icon: Sparkles },
    { id: 'assessment', label: 'قياس الأثر (قبلي/بعدي)', icon: Award },
    ...(role === 'teacher' ? [{ id: 'report', label: 'تقرير الإدارة', icon: FileText }] : []),
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-200">
      {/* Official Disclaimer Notice Bar */}
      <div className="bg-moe-navy text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-between">
        <span className="flex-1 text-center">
          ✨ مبادرة مدرسية إثرائية لتطوير مهارات كيمياء المرحلة الثانوية | «أتقن مهارتي – التوزيع الإلكتروني للذرات والأيونات»
        </span>
        <span className="hidden md:inline-block bg-moe-teal/30 px-2.5 py-0.5 rounded-full text-[11px] text-emerald-200 border border-moe-teal/40">
          متوسطة وثانوية جميما • 1448هـ
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Right side: Official MoE Logo & Title */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Ministry of Education Logo */}
              <div className="bg-white p-1 rounded-lg border border-slate-100 flex items-center justify-center h-14 w-auto transition-transform group-hover:scale-105">
                <img 
                  src="/moe_logo.svg" 
                  alt="شعار وزارة التعليم الرسمي" 
                  className="h-12 w-auto object-contain"
                  style={{ minWidth: '48px' }}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl font-black text-moe-navy tracking-tight">
                    أتقن مهارتي
                  </span>
                  <span className="text-xs bg-moe-green text-white px-2 py-0.5 rounded-md font-bold shadow-sm">
                    الذرات والأيونات
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
                  التوزيع الإلكتروني • أ. ذكرى آل صديق
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 relative ${
                    isActive
                      ? 'bg-moe-green text-white shadow-md shadow-moe-green/20'
                      : item.highlight
                      ? 'bg-moe-green-tint text-moe-green-dark hover:bg-moe-green/20 border border-moe-green/30'
                      : 'text-slate-600 hover:text-moe-navy hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-moe-green' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[9px] bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full font-black">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-moe-green opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-moe-green"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Left Actions: Teacher Mode & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Progress Badge */}
            {progressSummary && (
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200">
                <span className="text-moe-green font-bold">🎯 الإنجاز:</span>
                <span><bdi dir="ltr">{progressSummary.completedChallenges || 0}/{progressSummary.total}</bdi> تم</span>
              </div>
            )}

            {/* Teacher Dashboard Switch */}
            <button
              onClick={() => {
                handleNavClick(role === 'teacher' ? 'teacher' : role === 'student' ? 'progress' : 'login');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === (role === 'teacher' ? 'teacher' : role === 'student' ? 'progress' : 'login')
                  ? 'bg-moe-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
              title={role === 'teacher' ? 'لوحة المعلمة' : role === 'student' ? 'مستواي' : 'تسجيل الدخول'}
            >
              <Shield className="w-3.5 h-3.5 text-moe-teal" />
              <span>{role === 'teacher' ? 'لوحة المعلمة' : role === 'student' ? 'مستواي' : 'تسجيل الدخول'}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="القائمة"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-moe-green text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="text-[11px] bg-moe-teal text-white px-2 py-0.5 rounded-full font-normal">
                    القسم الأساسي
                  </span>
                )}
                {item.badge && !item.highlight && (
                  <span className="text-[10px] bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
