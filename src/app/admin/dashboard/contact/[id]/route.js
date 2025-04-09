import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/app/models/contact';

// الحصول على رسالة محددة
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الرسالة' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('خطأ في جلب الرسالة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الرسالة' },
      { status: 500 }
    );
  }
}

// تحديث رسالة (مثل تعليمها كمقروءة)
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const body = await request.json();
    
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الرسالة' },
        { status: 404 }
      );
    }
    
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

// حذف رسالة
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const deletedContact = await Contact.findByIdAndDelete(id);
    
    if (!deletedContact) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الرسالة' },
        { status: 404 }
      );
    }
    
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