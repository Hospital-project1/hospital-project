// // File: src/app/api/doctors/[id]/route.js
// import { NextResponse } from 'next/server';
// import connectDB from '../../../../lib/dbConnect';
// import Doctor from '../../../models/Doctor';
// import User from '../../../models/User';
// import mongoose from 'mongoose';

// // Get doctor by ID
// export async function GET(request, { params }) {
//   try {
//     await connectDB();
    
//     const doctorId = params.id;
    
//     // Validate MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(doctorId)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid doctor ID' },
//         { status: 400 }
//       );
//     }
    
//     // Find doctor by ID and populate user and patients
//     // Note: specialty is now a String so no need to populate it
//     const doctor = await Doctor.findById(doctorId)
//       .populate('user', '-password')
//     //   .populate('patients')
//       .lean();
      
//     if (!doctor) {
//       return NextResponse.json(
//         { success: false, message: 'Doctor not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       doctor
//     });
    
//   } catch (error) {
//     console.error('Error fetching doctor:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to fetch doctor', error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // Update doctor by ID
// export async function PUT(request, { params }) {
//   try {
//     await connectDB();
    
//     const doctorId = params.id;
//     const data = await request.json();
    
//     // Validate MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(doctorId)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid doctor ID' },
//         { status: 400 }
//       );
//     }
    
//     // Find doctor
//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) {
//       return NextResponse.json(
//         { success: false, message: 'Doctor not found' },
//         { status: 404 }
//       );
//     }
    
//     // Validate specialty if provided
//     if (data.specialty) {
//       const validSpecialties = ["Orthopedist", "Internist", "Dermatologist", "ENT Doctor", "doctor"];
//       if (!validSpecialties.includes(data.specialty)) {
//         return NextResponse.json(
//           { 
//             success: false, 
//             message: 'Invalid specialty value. Must be one of: ' + validSpecialties.join(', ') 
//           },
//           { status: 400 }
//         );
//       }
//       doctor.specialty = data.specialty;
//     }
    
//     // Update other doctor fields
//     if (data.availability) doctor.availability = data.availability;
//     if (data.details) doctor.details = data.details;
    
//     // Update user information if provided
//     if (data.name || data.email || data.phone || data.address || data.profilePicture) {
//       const user = await User.findById(doctor.user);
      
//       if (data.name) user.name = data.name;
//       if (data.email) user.email = data.email;
//       if (data.phone) user.phone = data.phone;
//       if (data.address) user.address = data.address;
//       if (data.profilePicture) user.profilePicture = data.profilePicture;
      
//       await user.save();
//     }
    
//     // Save updated doctor
//     const updatedDoctor = await doctor.save();
    
//     // Return updated doctor with populated user field
//     const result = await Doctor.findById(updatedDoctor._id)
//       .populate('user', '-password')
//       .lean();
    
//     return NextResponse.json({
//       success: true,
//       message: 'Doctor updated successfully',
//       doctor: result
//     });
    
//   } catch (error) {
//     console.error('Error updating doctor:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to update doctor', error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // Delete doctor by ID
// export async function DELETE(request, { params }) {
//   try {
//     await connectDB();
    
//     const doctorId = params.id;
    
//     // Validate MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(doctorId)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid doctor ID' },
//         { status: 400 }
//       );
//     }
    
//     // Find doctor
//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) {
//       return NextResponse.json(
//         { success: false, message: 'Doctor not found' },
//         { status: 404 }
//       );
//     }
    
//     // Get user ID
//     const userId = doctor.user;
    
//     // Delete doctor
//     await Doctor.findByIdAndDelete(doctorId);
    
//     // Mark user as deleted instead of actually deleting
//     await User.findByIdAndUpdate(userId, { isDeleted: true });
    
//     return NextResponse.json({
//       success: true,
//       message: 'Doctor deleted successfully'
//     });
    
//   } catch (error) {
//     console.error('Error deleting doctor:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to delete doctor', error: error.message },
//       { status: 500 }
//     );
//   }
// }

// File: src/app/api/doctors/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect';
import Doctor from '../../../models/Doctor';
import User from '../../../models/User';
import mongoose from 'mongoose';

// Get doctor by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const doctorId = params.id;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid doctor ID' },
        { status: 400 }
      );
    }
    
    // Find doctor by ID and populate user only (no patients)
    const doctor = await Doctor.findById(doctorId)
      .populate('user', '-password')
      .lean();
      
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      doctor
    });
    
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch doctor', error: error.message },
      { status: 500 }
    );
  }
}

// Update doctor by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const doctorId = params.id;
    const data = await request.json();
    
    // Log received data for debugging
    console.log('PUT request data:', data);
    console.log('Doctor ID:', doctorId);
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid doctor ID' },
        { status: 400 }
      );
    }
    
    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    console.log('Doctor found:', doctor ? 'Yes' : 'No');
    
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Log doctor data before update
    console.log('Before update:', {
      specialty: doctor.specialty,
      details: doctor.details,
      availability: doctor.availability
    });
    
    // Validate specialty if provided
    if (data.specialty) {
      const validSpecialties = ["Orthopedist", "Internist", "Dermatologist", "ENT Doctor", "doctor"];
      if (!validSpecialties.includes(data.specialty)) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Invalid specialty value. Must be one of: ' + validSpecialties.join(', ') 
          },
          { status: 400 }
        );
      }
      
      doctor.specialty = data.specialty;
      console.log('Updated specialty to:', data.specialty);
    }
    
    // Update other doctor fields
    if (data.availability) {
      doctor.availability = data.availability;
      console.log('Updated availability');
    }
    
    if (data.details) {
      doctor.details = data.details;
      console.log('Updated details to:', data.details);
    }
    
    // Update user information if provided
    if (data.name || data.email || data.phone || data.address || data.profilePicture) {
      const user = await User.findById(doctor.user);
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User associated with this doctor not found' },
          { status: 404 }
        );
      }
      
      if (data.name) {
        user.name = data.name;
        console.log('Updated name to:', data.name);
      }
      if (data.email) {
        user.email = data.email;
        console.log('Updated email to:', data.email);
      }
      if (data.phone) {
        user.phone = data.phone;
        console.log('Updated phone to:', data.phone);
      }
      if (data.address) {
        user.address = data.address;
        console.log('Updated address');
      }
      if (data.profilePicture) {
        user.profilePicture = data.profilePicture;
        console.log('Updated profilePicture');
      }
      
      try {
        await user.save();
        console.log('User saved successfully');
      } catch (userError) {
        console.error('Error saving user:', userError);
        return NextResponse.json(
          { success: false, message: 'Failed to update user information', error: userError.message },
          { status: 500 }
        );
      }
    }
    
    // Use updateOne instead of save() for more explicit update
    try {
      const updateResult = await Doctor.updateOne(
        { _id: doctorId },
        { 
          specialty: doctor.specialty,
          availability: doctor.availability,
          details: doctor.details
        }
      );
      
      console.log('Update result:', updateResult);
      
      if (updateResult.modifiedCount === 0) {
        console.warn('Warning: Doctor document not modified');
      }
    } catch (saveError) {
      console.error('Error saving doctor:', saveError);
      return NextResponse.json(
        { success: false, message: 'Failed to update doctor', error: saveError.message },
        { status: 500 }
      );
    }
    
    // Get updated doctor with populated fields
    const updatedDoctor = await Doctor.findById(doctorId)
      .populate('user', '-password')
      .lean();
    
    console.log('After update:', {
      specialty: updatedDoctor.specialty,
      details: updatedDoctor.details
    });
    
    return NextResponse.json({
      success: true,
      message: 'Doctor updated successfully',
      doctor: updatedDoctor
    });
    
  } catch (error) {
    console.error('Error in PUT handler:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update doctor', error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

// Delete doctor by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const doctorId = params.id;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid doctor ID' },
        { status: 400 }
      );
    }
    
    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Get user ID
    const userId = doctor.user;
    
    // Delete doctor
    await Doctor.findByIdAndDelete(doctorId);
    
    // Mark user as deleted instead of actually deleting
    await User.findByIdAndUpdate(userId, { isDeleted: true });
    
    return NextResponse.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete doctor', error: error.message },
      { status: 500 }
    );
  }
}