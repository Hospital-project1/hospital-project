import ContactForm from '/components/ContactForm';

export const metadata = {
  title: 'اتصل بنا | عيادة الرعاية الصحية',
  description: 'تواصل معنا للاستفسارات أو حجز المواعيد أو تقديم الملاحظات.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">اتصل بنا</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          <div>
            <h2 className="text-xl font-semibold mb-4">معلومات الاتصال</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">العنوان</h3>
                <p>شارع الملك عبدالله، عمان، الأردن</p>
              </div>
              
              <div>
                <h3 className="font-medium">رقم الهاتف</h3>
                <p dir="ltr">+962 6 123 4567</p>
              </div>
              
              <div>
                <h3 className="font-medium">البريد الإلكتروني</h3>
                <p dir="ltr">info@healthcareclinic.com</p>
              </div>
              
              <div>
                <h3 className="font-medium">ساعات العمل</h3>
                <p>السبت - الخميس: 9:00 صباحًا - 9:00 مساءً</p>
                <p>الجمعة: مغلق</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">الموقع</h2>
              <div className="bg-gray-200 h-64 w-full rounded-lg flex items-center justify-center">
                {/* يمكنك استبدال هذا بخريطة حقيقية باستخدام Google Maps أو أي خدمة خرائط أخرى */}
                <p className="text-gray-500">خريطة الموقع</p>
              </div>
            </div>
          </div>
          
          <div>
            <ContactForm />
          </div>
        </div>
        
        <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">أسئلة شائعة</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">كيف يمكنني حجز موعد؟</h3>
              <p>يمكنك حجز موعد عبر الهاتف أو من خلال صفحة المواعيد على موقعنا الإلكتروني.</p>
            </div>
            
            <div>
              <h3 className="font-medium">هل يمكنني إلغاء موعدي؟</h3>
              <p>نعم، يمكنك إلغاء موعدك قبل 24 ساعة على الأقل من الموعد المحدد.</p>
            </div>
            
            <div>
              <h3 className="font-medium">هل تقبلون التأمين الصحي؟</h3>
              <p>نعم، نتعامل مع معظم شركات التأمين الصحي. يرجى الاتصال بنا للتأكد من تغطية شركة التأمين الخاصة بك.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}