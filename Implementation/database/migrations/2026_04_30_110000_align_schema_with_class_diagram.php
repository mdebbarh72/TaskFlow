<?php

use App\Shared\Enums\UserStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('id');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('status')->default(UserStatus::ACTIVE->value)->after('role');
            $table->softDeletes();
        });

        DB::table('users')->select('id', 'name', 'is_banned')->orderBy('id')->chunk(100, function ($users): void {
            foreach ($users as $user) {
                $parts = preg_split('/\s+/', trim((string) $user->name)) ?: [];
                $firstName = $parts[0] ?? 'User';
                $lastName = trim(implode(' ', array_slice($parts, 1)));

                DB::table('users')->where('id', $user->id)->update([
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'status' => $user->is_banned ? UserStatus::BANNED->value : UserStatus::ACTIVE->value,
                ]);
            }
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['name', 'is_banned']);
        });

        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('username')->unique();
            $table->timestamps();
            $table->softDeletes();
        });

        DB::table('users')->select('id', 'first_name', 'last_name')->orderBy('id')->chunk(100, function ($users): void {
            foreach ($users as $user) {
                $base = trim($user->first_name . ' ' . $user->last_name) ?: 'user' . $user->id;
                $username = strtolower(preg_replace('/\s+/', '_', $base));

                $candidate = $username;
                $i = 1;
                while (DB::table('profiles')->where('username', $candidate)->exists()) {
                    $candidate = $username . '_' . $i;
                    $i++;
                }

                DB::table('profiles')->insert([
                    'user_id' => $user->id,
                    'username' => $candidate,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });

        Schema::table('memberships', function (Blueprint $table) {
            $table->timestamp('left_at')->nullable()->after('status');
        });

        Schema::table('sprints', function (Blueprint $table) {
            $table->timestamp('started_at')->nullable()->after('end_date');
            $table->timestamp('ended_at')->nullable()->after('started_at');
        });
        DB::table('sprints')->where('status', 'active')->update(['status' => 'in_process']);

        Schema::table('cards', function (Blueprint $table) {
            $table->timestamp('start_date')->nullable()->after('priority');
            $table->timestamp('end_date')->nullable()->after('start_date');
        });
        DB::table('cards')->where('status', 'testing')->update(['status' => 'reviewing']);

        Schema::table('comments', function (Blueprint $table) {
            $table->renameColumn('content', 'description');
            $table->softDeletes();
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->string('name')->nullable()->after('user_id');
            $table->string('description')->nullable()->after('name');
        });
        DB::table('activity_logs')->update([
            'name' => DB::raw('action'),
            'description' => DB::raw('action'),
        ]);
    }

    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropColumn(['name', 'description']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->renameColumn('description', 'content');
            $table->dropSoftDeletes();
        });

        Schema::table('cards', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date']);
        });

        Schema::table('sprints', function (Blueprint $table) {
            $table->dropColumn(['started_at', 'ended_at']);
        });
        DB::table('sprints')->where('status', 'in_process')->update(['status' => 'active']);

        Schema::table('memberships', function (Blueprint $table) {
            $table->dropColumn('left_at');
        });

        Schema::dropIfExists('profiles');

        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->boolean('is_banned')->default(false);
        });

        DB::table('users')->update([
            'name' => DB::raw("TRIM(CONCAT(first_name, ' ', last_name))"),
            'is_banned' => DB::raw("CASE WHEN status = 'banned' THEN true ELSE false END"),
        ]);

        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn(['first_name', 'last_name', 'status']);
        });
    }
};
