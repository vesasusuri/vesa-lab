<?php

namespace App\Http\Controllers;

use App\Models\PricingPlan;
use Illuminate\Http\Request;

class PricingPlanController extends Controller
{
    public function index()
    {
        return response()->json(PricingPlan::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:100',
            'price'      => 'required|string|max:50',
            'period'     => 'nullable|string|max:50',
            'summary'    => 'nullable|string',
            'highlights' => 'nullable|array',
            'featured'   => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $plan = PricingPlan::create([
            'name'       => $request->name,
            'price'      => $request->price,
            'period'     => $request->period ?? '/month',
            'summary'    => $request->summary,
            'highlights' => $request->highlights ?? [],
            'featured'   => $request->boolean('featured', false),
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return response()->json($plan, 201);
    }

    public function update(Request $request, $id)
    {
        $plan = PricingPlan::findOrFail($id);

        $request->validate([
            'name'       => 'required|string|max:100',
            'price'      => 'required|string|max:50',
            'period'     => 'nullable|string|max:50',
            'summary'    => 'nullable|string',
            'highlights' => 'nullable|array',
            'featured'   => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $plan->update([
            'name'       => $request->name,
            'price'      => $request->price,
            'period'     => $request->period ?? '/month',
            'summary'    => $request->summary,
            'highlights' => $request->highlights ?? [],
            'featured'   => $request->boolean('featured', false),
            'sort_order' => $request->sort_order ?? $plan->sort_order,
        ]);

        return response()->json($plan);
    }

    public function destroy($id)
    {
        PricingPlan::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
