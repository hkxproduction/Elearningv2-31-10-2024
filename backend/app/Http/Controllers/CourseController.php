<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    public function index()
    {
        return response()->json(Course::all(), 200);
    }

    public function show($id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        return response()->json($course, 200);
    }

  public function store(Request $request)
{
    // Validasi input termasuk validasi file gambar
    $request->validate([
        'title' => 'required|string|max:255',
        'status' => 'required|string',
        'category' => 'required|string',
        'sub_category' => 'nullable|string',
        'banner' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Hanya menerima file gambar
    ]);

    // Upload gambar dan mendapatkan pathnya ke storage
    $path = $request->file('banner')->store('banners', 'public');

    // Membuat entri course baru dengan data yang diterima
    $course = Course::create(array_merge(
        $request->except('banner'), 
        ['banner' => $path]
    ));

    // Mengembalikan response JSON dengan status 201 (Created)
    return response()->json($course, 201);
}

    

public function update(Request $request, $id)
{   
    Log::info($request->all());
    // Temukan course berdasarkan ID
    $course = Course::findOrFail($id);

    // Validasi input termasuk validasi file gambar
    $request->validate([
        'title' => 'required|string|max:255',
        'status' => 'required|string',
        'category' => 'required|string',
        'sub_category' => 'nullable|string',
        'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Hanya menerima file gambar, banner bisa null
    ]);

    // Jika ada file banner yang diupload, simpan dan perbarui pathnya
    if ($request->hasFile('banner')) {
        // Hapus banner lama jika ada (opsional)
        if ($course->banner) {
            Storage::disk('public')->delete($course->banner);
        }

        // Upload gambar dan mendapatkan pathnya ke storage
        $path = $request->file('banner')->store('banners', 'public');
        $course->banner = $path; // Perbarui path banner
    }

    // Perbarui entri course dengan data yang diterima
    $course->update($request->except('banner')); // Mengabaikan banner untuk update jika tidak diubah

    // Mengembalikan response JSON dengan status 200 (OK)
    return response()->json($course, 200);
}


    public function destroy($id)
{
    $course = Course::find($id);

    if (!$course) {
        return response()->json(['message' => 'Course not found'], 404);
    }

    // Hapus file gambar jika ada
    if ($course->banner && Storage::disk('public')->exists($course->banner)) {
        Storage::disk('public')->delete($course->banner); // Pastikan nama variabel 'banner' sesuai
    }

    // Hapus course
    $course->delete();

    return response()->json(['message' => 'Course deleted'], 200);
}

}
