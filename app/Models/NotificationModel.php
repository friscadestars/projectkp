<?php

namespace App\Models;

use CodeIgniter\Model;

class NotificationModel extends Model
{
    protected $table            = 'notifications';
    protected $primaryKey       = 'id';
    protected $allowedFields    = [
        'user_id', 'title', 'message', 'type', 'is_read', 'created_at', 'updated_at'
    ];
    protected $useTimestamps    = true;
}
