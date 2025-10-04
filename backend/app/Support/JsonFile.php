<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Facades\Storage;
use JsonException;
use RuntimeException;

final class JsonFile
{
    /**
     * Read JSON file from the local storage and return it as an array.
     */
    public static function read(string $relativePath): array
    {
        $disk = Storage::disk('local');

        if (! $disk->exists($relativePath)) {
            throw new RuntimeException("JSON not found: {$relativePath}");
        }

        $raw = $disk->get($relativePath);

        try {
            /** @var array $json */
            $json = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new RuntimeException("Invalid JSON in {$relativePath}: {$e->getMessage()}", previous: $e);
        }

        return $json;
    }

    /**
     * Atomically write an array as JSON to the local storage.
     */
    public static function writeAtomic(string $relativePath, array $payload): void
    {
        $disk = Storage::disk('local');
        $full = $disk->path($relativePath);
        $dir  = dirname($full);
        $tmp  = "{$full}.tmp";

        $encoded = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if ($encoded === false) {
            throw new RuntimeException("Failed to encode JSON for {$relativePath}");
        }

        if (! is_dir($dir) && ! mkdir($dir, 0775, true) && ! is_dir($dir)) {
            throw new RuntimeException("Cannot create directory for {$relativePath}");
        }

        $fh = fopen($tmp, 'wb');
        if ($fh === false) {
            throw new RuntimeException("Cannot open temp file for {$relativePath}");
        }

        try {
            if (! flock($fh, LOCK_EX)) {
                throw new RuntimeException("Cannot lock temp file for {$relativePath}");
            }

            if (fwrite($fh, $encoded) === false) {
                throw new RuntimeException("Cannot write to temp file for {$relativePath}");
            }

            fflush($fh);
            flock($fh, LOCK_UN);
        } finally {
            fclose($fh);
        }

        if (! rename($tmp, $full)) {
            @unlink($tmp);
            throw new RuntimeException("Cannot move temp file into {$relativePath}");
        }
    }
}