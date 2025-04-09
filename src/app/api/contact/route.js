import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/app/models/contact';

export async function POST(request) {
  try {
    // استخراج البيانات من الطلب
    const body = await request.json();
    const { name, email, subject, message } = body;

    // التحقق من وجود البيانات المطلوبة
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة: الاسم، البريد الإلكتروني، الموضوع، الرسالة' },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }

    // الاتصال بقاعدة البيانات
    await dbConnect();

    // إنشاء رسالة اتصال جديدة
    const contactMessage = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'تم إرسال رسالتك بنجاح', 
        data: contactMessage 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('خطأ في إنشاء رسالة الاتصال:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة طلبك' },
      { status: 500 }
    );
  }
}

// للحصول على جميع رسائل الاتصال (يمكن استخدامها للوحة التحكم)
export async function GET(request) {
  try {
    // الاتصال بقاعدة البيانات
    await dbConnect();

    // الحصول على جميع رسائل الاتصال مرتبة حسب تاريخ الإنشاء (الأحدث أولاً)
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error('خطأ في جلب رسائل الاتصال:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب رسائل الاتصال' },
      { status: 500 }
    );
  }
}