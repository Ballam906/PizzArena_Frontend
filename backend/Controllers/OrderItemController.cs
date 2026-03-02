using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PizzaArena_API.Services.OrderItemFolder.Dtos;
using PizzaArena_API.Services.OrderItemFolder.IOrderItemService;
using System.Security.Claims;

namespace PizzaArena_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        private readonly IOrderItem _orderItem;

        public OrderItemController(IOrderItem orderItem)
        {
            _orderItem = orderItem;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")] 
        public async Task<ActionResult> GetAll()
        {
            var result = await _orderItem.GetAllOrderItems();
            return Ok(result);
        }

        [HttpGet("GetByOrderId")]
        [Authorize]
        public async Task<ActionResult> GetById(int id)
        {
            var result = await _orderItem.GetItemsByOrderId(id);
            return Ok(result);
        }

        [HttpGet("MyOrders")]
        [Authorize]
        public async Task<ActionResult> GetMyOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _orderItem.GetUserOrders(userId);
            return Ok(result);
        }

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _orderItem.DeleteOrderItem(id);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create(OrderItemDto.OrderItemAddDto dto)
        {
            var result = await _orderItem.AddOrderItem(dto);
            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update(int id, OrderItemDto.OrderItemUpdateDto dto)
        {
            var result = await _orderItem.UpdateOrderItem(id, dto);
            return Ok(result);
        }

    }
}
