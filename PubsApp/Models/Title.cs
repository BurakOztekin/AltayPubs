using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PubsApp.Models;

public partial class Title
{
    [Required(ErrorMessage = "Title ID is required.")]
    [RegularExpression(@"^[a-zA-Z]{2}\d{4}$", ErrorMessage = "Title ID must be 2 letters followed by 4 numbers.")]
    public string TitleId { get; set; }

    public string Title1 { get; set; }

    public string Type { get; set; }

    public string PubId { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Price cannot be negative.")]
    public decimal? Price { get; set; }

    public decimal? Advance { get; set; }

    public int? Royalty { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "YTD Sales cannot be negative.")]
    public int? YtdSales { get; set; }

    public string Notes { get; set; }

    public DateTime Pubdate { get; set; }

    public virtual Publisher Pub { get; set; }

    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();

    public virtual ICollection<Titleauthor> Titleauthors { get; set; } = new List<Titleauthor>();
}
