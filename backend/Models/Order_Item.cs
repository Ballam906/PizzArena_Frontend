using PizzaArena_API.Models;
using System.ComponentModel.DataAnnotations.Schema;

public class Order_Item
{
    public int Id { get; set; }
    public int ItemPrice { get; set; }
    public int Piece { get; set; }
    public int Order_Id { get; set; }

    [ForeignKey(nameof(Order_Id))]
    public Order Order { get; set; }  

    public int Item_Id { get; set; }

    [ForeignKey(nameof(Item_Id))]
    public Product Product { get; set; }  // ne legyen JsonIgnore
}