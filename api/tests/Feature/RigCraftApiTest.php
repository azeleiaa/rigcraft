<?php

namespace Tests\Feature;

use Tests\TestCase;

class RigCraftApiTest extends TestCase
{
    /**
     * Test public catalog endpoint.
     */
    public function test_can_access_products_catalog(): void
    {
        $response = $this->getJson('/api/v1/products');

        // Status code must be 200 OK
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data',
        ]);
    }

    /**
     * Test builder validation logic without components returns success.
     */
    public function test_builder_validate_endpoint(): void
    {
        $response = $this->postJson('/api/v1/builder/validate', [
            'components' => [],
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'is_compatible' => true,
        ]);
    }

    /**
     * Test JWT Security: Protected endpoints block unauthenticated requests.
     */
    public function test_protected_routes_require_jwt_bearer_token(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        // Should return 401 Unauthorized when no Bearer token provided
        $response->assertStatus(401);
    }

    /**
     * Test Admin routes require admin privileges.
     */
    public function test_admin_routes_require_authorization(): void
    {
        $response = $this->getJson('/api/v1/admin/stats');

        // Blocked without token
        $response->assertStatus(401);
    }
}

