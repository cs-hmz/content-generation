<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExportRequest;
use App\Models\Export;
use App\Models\Generation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ExportController extends Controller
{
    public function store(StoreExportRequest $request, Generation $generation): JsonResponse
    {
        $this->authorize('view', $generation);

        $format = $request->format;

        if ($format === 'markdown') {
            return response()->streamDownload(function () use ($generation) {
                echo $generation->result;
            }, "generation-{$generation->id}.md", [
                'Content-Type' => 'text/markdown',
            ]);
        }

        if ($format === 'pdf') {
            $pdf = Pdf::loadHTML(view('exports.pdf', ['content' => $generation->result])->render());
            $path = "exports/{$generation->id}.pdf";
            Storage::disk('s3')->put($path, $pdf->output());

            $export = Export::create([
                'generation_id' => $generation->id,
                'format' => 'pdf',
                'storage_path' => $path,
                'created_at' => now(),
            ]);

            $url = Storage::disk('s3')->temporaryUrl($path, now()->addMinutes(60));

            return response()->json([
                'url' => $url,
                'export_id' => $export->id,
            ]);
        }

        // docx fallback - return as downloadable text for now
        return response()->streamDownload(function () use ($generation) {
            echo $generation->result;
        }, "generation-{$generation->id}.docx", [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]);
    }
}