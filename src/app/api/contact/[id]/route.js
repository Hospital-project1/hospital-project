import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/app/models/contact';

// الحصول على رسالة محددة بواسطة المعرف
export async function GET(request, { params }) {
  try {
    // الاتصال بقاعدة البيانات
    await dbConnect();
    
    // استخراج المعرف من المسار
    const { id } = params;
    
    // البحث عن الرسالة باستخدام المعرف
    const contact = await Contact.findById(id);
    
    // التحقق من وجود الرسالة
    if (!contact) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الرسالة' },
        { status: 404 }
      );
    }
    
    // إرجاع الرسالة
    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('خطأ في جلب الرسالة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الرسالة' },
      { status: 500 }
    );
  }
}

// تحديث رسالة محددة (مثل تغيير حالة القراءة)
export async function PATCH(request, { params }) {
  try {
    // الاتصال بقاعدة البيانات
    await dbConnect();
    
    // استخراج المعرف من المسار
    const { id } = params;
    
    // استخراج بيانات التحديث من جسم الطلب
    const body = await request.json();
    
    // تحديث الرسالة والحصول على البيانات المحدثة
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    // التحقق من وجود الرسالة
    if (!updatedContact) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الرسالة' },
        { status: 404 }
      );
    }
    
    // إرجاع الرسالة المحدثة
    return NextResponse.json({ 
      success: true, 
      message: 'تم تحديث الرسالة بنجاح',
      data: updatedContact 
    });
  } catch (error) {
    console.error('خطأ في تحديث الرسالة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الرسالة' },
      { status: 500 }
    );
  }
}

// حذف رسالة محددة
export async function DELETE(request, { params }) {
  try {
    // الاتصال بقاعدة البيانات
    await dbConnect();
    
    // استخراج المعرف من المسار
    const { id } = params;
    
    // حذف الرسالة والحصول على البيانات المحذوفة
    const deletedContact = await Contact.findByIdAndDelete(id);
    
    // التحقق من وجود الرسالة
    if (!deletedContact) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الرسالة' },
        { status: 404 }
      );
    }
    
    // إرجاع رسالة نجاح
    return NextResponse.json({ 
      success: true, 
      message: 'تم حذف الرسالة بنجاح' 
    });
  } catch (error) {
    console.error('خطأ في حذف الرسالة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الرسالة' },
      { status: 500 }
    );
  }
}